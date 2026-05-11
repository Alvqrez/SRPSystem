import { useState, useEffect } from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";
import { getAuthToken } from "../context/AuthContext";

const WEEK_DAYS  = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS     = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FORM_TYPES = ["Asesoría","Revisión","Evaluación","Entrega","Otro"];

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

// ── Helpers de fecha ──────────────────────────────────────────────────────────
const ONE_MONTH_AGO = (() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d; })();

const isNotExpired = (ev) =>
  new Date(ev.year, ev.monthIndex, ev.day) >= ONE_MONTH_AGO;

// Eventos predefinidos (se filtran al inicializar)
const EVENTS_INIT_RAW = {
  "2026-0": {
    8:  [{ label: "Asesoría grupal",           color: C.blue,   bg: C.blueLight   }],
    15: [{ label: "Entrega Reporte Parcial 1", color: C.red,    bg: C.redLight    }],
    20: [{ label: "Vencimiento convenio",      color: C.amber,  bg: C.amberLight  }],
    23: [{ label: "Cita Dr. Martínez",         color: C.purple, bg: C.purpleLight }],
    27: [{ label: "Revisión de avances",       color: C.teal,   bg: C.tealLight   }],
  },
};

const UPCOMING_INIT_RAW = [
  { day:15, month:"Ene", monthIndex:0, year:2026, title:"Entrega Reporte Parcial 1",       time:"Todo el día",          color:C.red,    bg:C.redLight,    icon:"file-text"    },
  { day:20, month:"Ene", monthIndex:0, year:2026, title:"Vencimiento convenio SoftSolutions",time:"23:59",              color:C.amber,  bg:C.amberLight,  icon:"alert-triangle"},
  { day:23, month:"Ene", monthIndex:0, year:2026, title:"Cita con Dr. Martínez",            time:"10:00 AM · Sala 204", color:C.purple, bg:C.purpleLight, icon:"user"          },
  { day:27, month:"Ene", monthIndex:0, year:2026, title:"Revisión de avances",             time:"2:00 PM · Virtual",   color:C.teal,   bg:C.tealLight,   icon:"monitor"       },
];

// Filtra eventos de EVENTS_INIT más viejos de 1 mes
const filterOldEvents = (raw) => {
  const result = {};
  Object.entries(raw).forEach(([key, days]) => {
    const [year, month] = key.split("-").map(Number);
    const validDays = {};
    Object.entries(days).forEach(([day, evs]) => {
      if (new Date(year, month, Number(day)) >= ONE_MONTH_AGO) validDays[day] = evs;
    });
    if (Object.keys(validDays).length) result[key] = validDays;
  });
  return result;
};

// ── Auto-formato para fecha ───────────────────────────────────────────────────
const formatDateInput = (raw) => {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length > 4) return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0,2)}/${d.slice(2)}`;
  return d;
};

// ── Auto-formato para hora ────────────────────────────────────────────────────
const formatTimeInput = (raw) => {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length > 2) return `${d.slice(0,2)}:${d.slice(2)}`;
  return d;
};

// ── Validaciones ─────────────────────────────────────────────────────────────
const validateDate = (str) => {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]), month = Number(m[2]) - 1, year = Number(m[3]);
  const d = new Date(year, month, day);
  if (d.getMonth() !== month || d.getDate() !== day) return null;
  return d;
};

const validateTime = (str) => {
  const m = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return false;
  const h = Number(m[1]), min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
};

// ── Guardar cita en API ───────────────────────────────────────────────────────
const saveCitaAPI = async (payload) => {
  try {
    const token = getAuthToken();
    if (!token) return; // Demo mode: sin backend
    await fetch("http://localhost:3001/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("No se pudo guardar la cita en BD:", e.message);
  }
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function CalendarioCitas() {
  const [selected,   setSelected]   = useState(null);
  const [monthDate,  setMonthDate]  = useState(() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), 1); });
  const [events,     setEvents]     = useState(() => filterOldEvents(EVENTS_INIT_RAW));
  const [upcoming,   setUpcoming]   = useState(() => UPCOMING_INIT_RAW.filter(isNotExpired));

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formType,  setFormType]  = useState("Asesoría");
  const [formDate,  setFormDate]  = useState("");
  const [formTime,  setFormTime]  = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  // Auto-limpiar citas expiradas al montar (1 mes gracia)
  useEffect(() => {
    setUpcoming((prev) => prev.filter(isNotExpired));
  }, []);

  const monthName    = `${MONTHS[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  const currentEvents = events[monthKey(monthDate)] || {};
  const daysInMonth  = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const startDay     = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const realToday = new Date();
  const today = monthDate.getMonth() === realToday.getMonth() &&
                monthDate.getFullYear() === realToday.getFullYear()
    ? realToday.getDate() : null;

  const changeMonth = (delta) => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setSelected(null);
  };

  const openModal = () => {
    setFormDate(""); setFormTime(""); setFormNotes(""); setFormType("Asesoría");
    setDateError(""); setTimeError("");
    setShowModal(true);
  };

  const handleDateChange = (raw) => {
    const fmt = formatDateInput(raw);
    setFormDate(fmt);
    if (fmt.length === 10) {
      setDateError(validateDate(fmt) ? "" : "Fecha inválida");
    } else {
      setDateError("");
    }
  };

  const handleTimeChange = (raw) => {
    const fmt = formatTimeInput(raw);
    setFormTime(fmt);
    if (fmt.length === 5) {
      setTimeError(validateTime(fmt) ? "" : "Hora inválida (HH:MM, 00-23)");
    } else {
      setTimeError("");
    }
  };

  const confirmAppointment = () => {
    const date = validateDate(formDate);
    if (!date) {
      setDateError("Ingresa una fecha válida (DD/MM/AAAA)");
      return;
    }
    if (!validateTime(formTime)) {
      setTimeError("Ingresa una hora válida (HH:MM)");
      return;
    }

    const [hh, mm] = formTime.split(":").map(Number);
    date.setHours(hh, mm, 0, 0);

    const day   = date.getDate();
    const month = date.getMonth();
    const year  = date.getFullYear();
    const title = formNotes.trim() || formType;
    const key   = monthKey(new Date(year, month, 1));

    // Guardar en BD (fire-and-forget)
    saveCitaAPI({
      tipo:       formType,
      motivo:     title,
      notas:      formNotes.trim() || null,
      fecha_hora: date.toISOString().slice(0, 19).replace("T", " "),
    });

    // Actualizar estado local
    setEvents((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [day]: [...(prev[key]?.[day] || []), { label: title, color: C.teal, bg: C.tealLight }],
      },
    }));
    setUpcoming((prev) => [
      ...prev,
      {
        day,
        month:      MONTHS[month].slice(0, 3),
        monthIndex: month,
        year,
        title,
        time:  formTime,
        color: C.teal,
        bg:    C.tealLight,
        icon:  "calendar",
      },
    ]);
    setMonthDate(new Date(year, month, 1));
    setSelected(day);
    setShowModal(false);
    Alert.alert("Cita agendada", `"${title}" se agregó al calendario.`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Calendario de Citas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Agenda y gestión de reuniones</Text>
        </View>
        <TouchableOpacity onPress={openModal} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 9 }}>
          <Feather name="plus" size={14} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Agendar cita</Text>
        </TouchableOpacity>
      </Row>

      <Row style={{ gap: 18, alignItems: "flex-start" }}>
        {/* Left: Calendar */}
        <View style={{ flex: 1 }}>
          <Card style={{ marginBottom: 16 }}>
            {/* Month nav */}
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={{ width:34, height:34, borderRadius:9, borderWidth:1, borderColor:C.border, alignItems:"center", justifyContent:"center", backgroundColor:C.bg }}>
                <Feather name="chevron-left" size={16} color={C.textMuted} />
              </TouchableOpacity>
              <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }}>{monthName}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)} style={{ width:34, height:34, borderRadius:9, borderWidth:1, borderColor:C.border, alignItems:"center", justifyContent:"center", backgroundColor:C.bg }}>
                <Feather name="chevron-right" size={16} color={C.textMuted} />
              </TouchableOpacity>
            </Row>
            {/* Week headers */}
            <Row style={{ marginBottom: 8 }}>
              {WEEK_DAYS.map((wd) => (
                <View key={wd} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted }}>{wd}</Text>
                </View>
              ))}
            </Row>
            {/* Grid */}
            <View>
              {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
                <Row key={rowIdx} style={{ marginBottom: 4 }}>
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                    const hasEvent  = day && currentEvents[day];
                    const isSelected = day === selected;
                    const isToday   = day === today;
                    return (
                      <TouchableOpacity
                        key={colIdx}
                        onPress={() => day && setSelected(day)}
                        disabled={!day}
                        style={{ flex:1, alignItems:"center", paddingVertical:6, borderRadius:9,
                          backgroundColor: isSelected ? C.teal : isToday ? C.tealLighter : "transparent",
                          borderWidth: isToday && !isSelected ? 1.5 : 0, borderColor: C.teal,
                          minHeight:52, justifyContent:"flex-start", paddingTop:7 }}
                      >
                        {day ? (
                          <>
                            <Text style={{ fontSize:13, fontWeight: isSelected||isToday ? "800":"500",
                              color: isSelected ? "white" : isToday ? C.teal : C.text, marginBottom:3 }}>
                              {day}
                            </Text>
                            {hasEvent && (
                              <View style={{ gap:2, alignItems:"center" }}>
                                {currentEvents[day].slice(0,2).map((ev, ei) => (
                                  <View key={ei} style={{ width:6, height:6, borderRadius:3,
                                    backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : ev.color }} />
                                ))}
                              </View>
                            )}
                          </>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                  {cells.slice(rowIdx*7, rowIdx*7+7).length < 7 &&
                    Array.from({ length: 7 - cells.slice(rowIdx*7, rowIdx*7+7).length }).map((_, pi) => (
                      <View key={`p-${pi}`} style={{ flex:1 }} />
                    ))}
                </Row>
              ))}
            </View>
          </Card>

          {/* Selected day events */}
          {selected && (
            <Card>
              <Row style={{ alignItems:"center", gap:8, marginBottom:14 }}>
                <View style={{ width:36, height:36, borderRadius:10, backgroundColor:C.teal, alignItems:"center", justifyContent:"center" }}>
                  <Text style={{ fontSize:14, fontWeight:"800", color:"white" }}>{selected}</Text>
                </View>
                <View>
                  <Text style={{ fontSize:13, fontWeight:"700", color:C.text }}>{selected} de {monthName}</Text>
                  <Text style={{ fontSize:11, color:C.textMuted }}>
                    {currentEvents[selected] ? `${currentEvents[selected].length} evento(s)` : "Sin eventos"}
                  </Text>
                </View>
              </Row>
              {currentEvents[selected] ? (
                currentEvents[selected].map((ev, i) => (
                  <Row key={i} style={{ alignItems:"center", gap:10, backgroundColor:ev.bg, borderRadius:9, padding:11, marginBottom:8 }}>
                    <View style={{ width:8, height:8, borderRadius:4, backgroundColor:ev.color }} />
                    <Text style={{ fontSize:13, fontWeight:"700", color:ev.color, flex:1 }}>{ev.label}</Text>
                    <Feather name="chevron-right" size={14} color={ev.color} />
                  </Row>
                ))
              ) : (
                <View style={{ alignItems:"center", paddingVertical:18, backgroundColor:C.bg, borderRadius:10 }}>
                  <Feather name="calendar" size={22} color={C.textLight} style={{ marginBottom:6 }} />
                  <Text style={{ fontSize:12, color:C.textMuted }}>No hay eventos este día</Text>
                </View>
              )}
            </Card>
          )}
        </View>

        {/* Right: Upcoming */}
        <View style={{ width: 290 }}>
          <Card>
            <Text style={{ fontSize:13, fontWeight:"800", color:C.text, marginBottom:14 }}>Próximas Citas</Text>
            {upcoming.length === 0 ? (
              <View style={{ alignItems:"center", paddingVertical:20 }}>
                <Feather name="calendar" size={24} color={C.textLight} style={{ marginBottom:8 }} />
                <Text style={{ fontSize:12, color:C.textMuted }}>Sin citas próximas</Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {upcoming.map((ev, i) => (
                  <TouchableOpacity key={i}
                    onPress={() => { if (ev.year !== undefined) setMonthDate(new Date(ev.year, ev.monthIndex, 1)); setSelected(ev.day); }}
                    activeOpacity={0.8}
                    style={{ flexDirection:"row", alignItems:"flex-start", gap:10, padding:11, borderRadius:10,
                      backgroundColor:ev.bg, borderWidth:1, borderColor: selected===ev.day ? ev.color : "transparent" }}
                  >
                    <View style={{ width:40, height:40, borderRadius:10, backgroundColor:ev.color, alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Text style={{ fontSize:14, fontWeight:"800", color:"white", lineHeight:16 }}>{ev.day}</Text>
                      <Text style={{ fontSize:9, color:"rgba(255,255,255,0.8)", fontWeight:"600" }}>{ev.month}</Text>
                    </View>
                    <View style={{ flex:1 }}>
                      <Text style={{ fontSize:12, fontWeight:"700", color:ev.color, marginBottom:2 }} numberOfLines={2}>{ev.title}</Text>
                      <Row style={{ alignItems:"center", gap:4 }}>
                        <Feather name="clock" size={10} color={ev.color} style={{ opacity:0.7 }} />
                        <Text style={{ fontSize:10, color:ev.color, opacity:0.8 }}>{ev.time}</Text>
                      </Row>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={openModal} style={{ marginTop:14, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6, borderWidth:1.5, borderColor:C.teal, borderRadius:9, paddingVertical:9, borderStyle:"dashed" }}>
              <Feather name="plus" size={13} color={C.teal} />
              <Text style={{ fontSize:12, fontWeight:"700", color:C.teal }}>Agendar nueva cita</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Row>

      {/* ── Modal: Agendar Cita ─────────────────────────────────────────────── */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex:1, backgroundColor:"rgba(0,0,0,0.45)", justifyContent:"center", alignItems:"center", padding:24 }}>
          <View style={{ backgroundColor:C.card, borderRadius:16, width:"100%", maxWidth:460, shadowColor:"#000", shadowOpacity:0.2, shadowRadius:20, elevation:10 }}>
            {/* Header */}
            <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
              <Row style={{ alignItems:"center", gap:10 }}>
                <View style={{ width:36, height:36, borderRadius:10, backgroundColor:C.tealLight, alignItems:"center", justifyContent:"center" }}>
                  <Feather name="calendar" size={16} color={C.teal} />
                </View>
                <View>
                  <Text style={{ fontSize:15, fontWeight:"800", color:C.text }}>Agendar cita</Text>
                  <Text style={{ fontSize:11, color:C.textMuted }}>Completa los datos para registrarla</Text>
                </View>
              </Row>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ width:32, height:32, borderRadius:8, backgroundColor:C.bg, alignItems:"center", justifyContent:"center" }}>
                <Feather name="x" size={16} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
              {/* Tipo */}
              <Text style={labelStyle}>Tipo de cita</Text>
              <Row style={{ flexWrap:"wrap", gap:6, marginBottom:16 }}>
                {FORM_TYPES.map((t) => (
                  <TouchableOpacity key={t} onPress={() => setFormType(t)}
                    style={{ paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                      backgroundColor: formType===t ? C.teal : C.bg,
                      borderWidth:1, borderColor: formType===t ? C.teal : C.border }}>
                    <Text style={{ fontSize:12, fontWeight:"700", color: formType===t ? "white" : C.textMuted }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </Row>

              {/* Fecha con auto-formato */}
              <Text style={labelStyle}>Fecha</Text>
              <Row style={{ alignItems:"center", borderWidth:1, borderColor: dateError ? C.red : C.border, borderRadius:9, paddingHorizontal:12, gap:8, backgroundColor:C.bg, marginBottom: dateError ? 4 : 14 }}>
                <Feather name="calendar" size={13} color={dateError ? C.red : C.textMuted} />
                <TextInput
                  value={formDate}
                  onChangeText={handleDateChange}
                  placeholder="DD / MM / AAAA"
                  placeholderTextColor={C.textLight}
                  keyboardType="numeric"
                  maxLength={10}
                  style={{ flex:1, paddingVertical:10, fontSize:13, color:C.text }}
                />
                {formDate.length === 10 && !dateError && (
                  <Feather name="check-circle" size={14} color={C.green} />
                )}
              </Row>
              {dateError ? <Text style={{ fontSize:11, color:C.red, marginBottom:12 }}>{dateError}</Text> : null}

              {/* Hora con auto-formato */}
              <Text style={labelStyle}>Hora</Text>
              <Row style={{ alignItems:"center", borderWidth:1, borderColor: timeError ? C.red : C.border, borderRadius:9, paddingHorizontal:12, gap:8, backgroundColor:C.bg, marginBottom: timeError ? 4 : 14 }}>
                <Feather name="clock" size={13} color={timeError ? C.red : C.textMuted} />
                <TextInput
                  value={formTime}
                  onChangeText={handleTimeChange}
                  placeholder="HH : MM"
                  placeholderTextColor={C.textLight}
                  keyboardType="numeric"
                  maxLength={5}
                  style={{ flex:1, paddingVertical:10, fontSize:13, color:C.text }}
                />
                {formTime.length === 5 && !timeError && (
                  <Feather name="check-circle" size={14} color={C.green} />
                )}
              </Row>
              {timeError ? <Text style={{ fontSize:11, color:C.red, marginBottom:12 }}>{timeError}</Text> : null}

              {/* Notas */}
              <Text style={labelStyle}>Notas adicionales</Text>
              <TextInput
                value={formNotes}
                onChangeText={setFormNotes}
                placeholder="Observaciones, lugar, detalles..."
                placeholderTextColor={C.textLight}
                multiline
                numberOfLines={3}
                style={{ borderWidth:1, borderColor:C.border, borderRadius:9, paddingHorizontal:12, paddingVertical:10, fontSize:13, color:C.text, backgroundColor:C.bg, textAlignVertical:"top", marginBottom:20, minHeight:80 }}
              />

              {/* Botones */}
              <Row style={{ gap:10, marginBottom:4 }}>
                <TouchableOpacity onPress={() => setShowModal(false)} style={{ flex:1, borderRadius:9, paddingVertical:11, alignItems:"center", backgroundColor:C.bg, borderWidth:1, borderColor:C.border }}>
                  <Text style={{ color:C.textMuted, fontWeight:"700", fontSize:13 }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmAppointment} style={{ flex:2, backgroundColor:C.teal, borderRadius:9, paddingVertical:11, alignItems:"center", flexDirection:"row", justifyContent:"center", gap:7 }}>
                  <Feather name="check" size={14} color="white" />
                  <Text style={{ color:"white", fontWeight:"700", fontSize:13 }}>Confirmar cita</Text>
                </TouchableOpacity>
              </Row>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const labelStyle = {
  fontSize:11, fontWeight:"700", color:C.textSub,
  marginBottom:6, textTransform:"uppercase", letterSpacing:0.4,
};
