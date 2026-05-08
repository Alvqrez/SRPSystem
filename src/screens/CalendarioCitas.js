import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";

const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Eventos iniciales — Enero 2026
const EVENTS_INIT = {
  "2026-0": {
    8: [{ label: "Asesoría grupal", color: C.blue, bg: C.blueLight }],
    15: [{ label: "Entrega Reporte Parcial 1", color: C.red, bg: C.redLight }],
    20: [{ label: "Vencimiento convenio", color: C.amber, bg: C.amberLight }],
    23: [{ label: "Cita Dr. Martínez", color: C.purple, bg: C.purpleLight }],
    27: [{ label: "Revisión de avances", color: C.teal, bg: C.tealLight }],
  },
};

const UPCOMING_INIT = [
  {
    day: 15,
    month: "Ene",
    monthIndex: 0,
    year: 2026,
    title: "Entrega Reporte Parcial 1",
    time: "Todo el día",
    color: C.red,
    bg: C.redLight,
    icon: "file-text",
  },
  {
    day: 20,
    month: "Ene",
    monthIndex: 0,
    year: 2026,
    title: "Vencimiento convenio SoftSolutions",
    time: "23:59",
    color: C.amber,
    bg: C.amberLight,
    icon: "alert-triangle",
  },
  {
    day: 23,
    month: "Ene",
    monthIndex: 0,
    year: 2026,
    title: "Cita con Dr. Martínez",
    time: "10:00 AM · Sala 204",
    color: C.purple,
    bg: C.purpleLight,
    icon: "user",
  },
  {
    day: 27,
    month: "Ene",
    monthIndex: 0,
    year: 2026,
    title: "Revisión de avances",
    time: "2:00 PM · Virtual",
    color: C.teal,
    bg: C.tealLight,
    icon: "monitor",
  },
];

const FORM_TYPES = ["Asesoría", "Revisión", "Evaluación", "Entrega", "Otro"];

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

export default function CalendarioCitas() {
  const [selected, setSelected] = useState(null);
  const [monthDate, setMonthDate] = useState(new Date(2026, 0, 1)); // Enero 2026
  const [events, setEvents] = useState(EVENTS_INIT);
  const [upcoming, setUpcoming] = useState(UPCOMING_INIT);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("Asesoría");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const monthName = `${MONTHS[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  const currentEvents = events[monthKey(monthDate)] || {};
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  const startDay = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1,
  ).getDay();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // "Hoy" dinámico
  const realToday = new Date();
  const today =
    monthDate.getMonth() === realToday.getMonth() &&
    monthDate.getFullYear() === realToday.getFullYear()
      ? realToday.getDate()
      : null;

  const changeMonth = (delta) => {
    setMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
    setSelected(null);
  };

  const openModal = () => {
    setFormDate("");
    setFormTime("");
    setFormNotes("");
    setFormType("Asesoría");
    setShowModal(true);
  };

  const confirmAppointment = () => {
    const match = formDate.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (!match || !formTime.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Captura fecha con formato DD/MM/AAAA y hora.",
      );
      return;
    }

    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const date = new Date(year, month, day);

    if (date.getMonth() !== month || date.getDate() !== day) {
      Alert.alert("Fecha inválida", "Revisa la fecha de la cita.");
      return;
    }

    const title = formNotes.trim() || formType;
    const newEvent = { label: title, color: C.teal, bg: C.tealLight };
    const key = monthKey(new Date(year, month, 1));

    setEvents((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [day]: [...(prev[key]?.[day] || []), newEvent],
      },
    }));
    setUpcoming((prev) => [
      ...prev,
      {
        day,
        month: MONTHS[month].slice(0, 3),
        monthIndex: month,
        year,
        title,
        time: formTime.trim(),
        color: C.teal,
        bg: C.tealLight,
        icon: "calendar",
      },
    ]);
    setMonthDate(new Date(year, month, 1));
    setSelected(day);
    setShowModal(false);
    Alert.alert("Cita agendada", `"${title}" se agregó al calendario.`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* Header */}
      <Row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>
            Calendario de Citas
          </Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            Agenda y gestión de reuniones
          </Text>
        </View>
        <TouchableOpacity
          onPress={openModal}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: C.teal,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 9,
          }}
        >
          <Feather name="plus" size={14} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
            Agendar cita
          </Text>
        </TouchableOpacity>
      </Row>

      <Row style={{ gap: 18, alignItems: "flex-start" }}>
        {/* Left: Calendar */}
        <View style={{ flex: 1 }}>
          <Card style={{ marginBottom: 16 }}>
            {/* Month nav */}
            <Row
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: C.bg,
                }}
              >
                <Feather name="chevron-left" size={16} color={C.textMuted} />
              </TouchableOpacity>
              <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }}>
                {monthName}
              </Text>
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: C.bg,
                }}
              >
                <Feather name="chevron-right" size={16} color={C.textMuted} />
              </TouchableOpacity>
            </Row>

            {/* Week day headers */}
            <Row style={{ marginBottom: 8 }}>
              {WEEK_DAYS.map((wd) => (
                <View key={wd} style={{ flex: 1, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: C.textMuted,
                    }}
                  >
                    {wd}
                  </Text>
                </View>
              ))}
            </Row>

            {/* Calendar grid */}
            <View>
              {Array.from({ length: Math.ceil(cells.length / 7) }).map(
                (_, rowIdx) => (
                  <Row key={rowIdx} style={{ marginBottom: 4 }}>
                    {cells
                      .slice(rowIdx * 7, rowIdx * 7 + 7)
                      .map((day, colIdx) => {
                        const hasEvent = day && currentEvents[day];
                        const isSelected = day === selected;
                        const isToday = day === today;
                        return (
                          <TouchableOpacity
                            key={colIdx}
                            onPress={() => day && setSelected(day)}
                            disabled={!day}
                            style={{
                              flex: 1,
                              alignItems: "center",
                              paddingVertical: 6,
                              borderRadius: 9,
                              backgroundColor: isSelected
                                ? C.teal
                                : isToday
                                  ? C.tealLighter
                                  : "transparent",
                              borderWidth: isToday && !isSelected ? 1.5 : 0,
                              borderColor: C.teal,
                              minHeight: 52,
                              justifyContent: "flex-start",
                              paddingTop: 7,
                            }}
                          >
                            {day ? (
                              <>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontWeight:
                                      isSelected || isToday ? "800" : "500",
                                    color: isSelected
                                      ? "white"
                                      : isToday
                                        ? C.teal
                                        : C.text,
                                    marginBottom: 3,
                                  }}
                                >
                                  {day}
                                </Text>
                                {hasEvent && (
                                  <View
                                    style={{ gap: 2, alignItems: "center" }}
                                  >
                                    {currentEvents[day]
                                      .slice(0, 2)
                                      .map((ev, ei) => (
                                        <View
                                          key={ei}
                                          style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: isSelected
                                              ? "rgba(255,255,255,0.7)"
                                              : ev.color,
                                          }}
                                        />
                                      ))}
                                  </View>
                                )}
                              </>
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    {cells.slice(rowIdx * 7, rowIdx * 7 + 7).length < 7 &&
                      Array.from({
                        length:
                          7 - cells.slice(rowIdx * 7, rowIdx * 7 + 7).length,
                      }).map((_, pi) => (
                        <View key={`pad-${pi}`} style={{ flex: 1 }} />
                      ))}
                  </Row>
                ),
              )}
            </View>
          </Card>

          {/* Selected day events */}
          {selected && (
            <Card>
              <Row style={{ alignItems: "center", gap: 8, marginBottom: 14 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: C.teal,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "800", color: "white" }}
                  >
                    {selected}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 13, fontWeight: "700", color: C.text }}
                  >
                    {selected} de {monthName}
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    {currentEvents[selected]
                      ? `${currentEvents[selected].length} evento(s)`
                      : "Sin eventos"}
                  </Text>
                </View>
              </Row>

              {currentEvents[selected] ? (
                currentEvents[selected].map((ev, i) => (
                  <Row
                    key={i}
                    style={{
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: ev.bg,
                      borderRadius: 9,
                      padding: 11,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: ev.color,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: ev.color,
                        flex: 1,
                      }}
                    >
                      {ev.label}
                    </Text>
                    <Feather name="chevron-right" size={14} color={ev.color} />
                  </Row>
                ))
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 18,
                    backgroundColor: C.bg,
                    borderRadius: 10,
                  }}
                >
                  <Feather
                    name="calendar"
                    size={22}
                    color={C.textLight}
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={{ fontSize: 12, color: C.textMuted }}>
                    No hay eventos este día
                  </Text>
                </View>
              )}
            </Card>
          )}
        </View>

        {/* Right: Upcoming only */}
        <View style={{ width: 290 }}>
          <Card>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: C.text,
                marginBottom: 14,
              }}
            >
              Próximas Citas
            </Text>
            <View style={{ gap: 10 }}>
              {upcoming.map((ev, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (ev.year !== undefined && ev.monthIndex !== undefined) {
                      setMonthDate(new Date(ev.year, ev.monthIndex, 1));
                    }
                    setSelected(ev.day);
                  }}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: 11,
                    borderRadius: 10,
                    backgroundColor: ev.bg,
                    borderWidth: 1,
                    borderColor: selected === ev.day ? ev.color : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: ev.color,
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: "white",
                        lineHeight: 16,
                      }}
                    >
                      {ev.day}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: "600",
                      }}
                    >
                      {ev.month}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: ev.color,
                        marginBottom: 2,
                      }}
                      numberOfLines={2}
                    >
                      {ev.title}
                    </Text>
                    <Row style={{ alignItems: "center", gap: 4 }}>
                      <Feather
                        name="clock"
                        size={10}
                        color={ev.color}
                        style={{ opacity: 0.7 }}
                      />
                      <Text
                        style={{ fontSize: 10, color: ev.color, opacity: 0.8 }}
                      >
                        {ev.time}
                      </Text>
                    </Row>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* CTA to open modal */}
            <TouchableOpacity
              onPress={openModal}
              style={{
                marginTop: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderWidth: 1.5,
                borderColor: C.teal,
                borderRadius: 9,
                paddingVertical: 9,
                borderStyle: "dashed",
              }}
            >
              <Feather name="plus" size={13} color={C.teal} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: C.teal }}>
                Agendar nueva cita
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Row>

      {/* ── Modal: Agendar Cita ─────────────────────────────── */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Modal header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}
            >
              <Row style={{ alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: C.tealLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="calendar" size={16} color={C.teal} />
                </View>
                <View>
                  <Text
                    style={{ fontSize: 15, fontWeight: "800", color: C.text }}
                  >
                    Agendar cita
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    Completa los datos para registrarla
                  </Text>
                </View>
              </Row>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: C.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="x" size={16} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ padding: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Tipo de cita */}
              <Text style={labelStyle}>Tipo de cita</Text>
              <Row style={{ flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {FORM_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setFormType(t)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: formType === t ? C.teal : C.bg,
                      borderWidth: 1,
                      borderColor: formType === t ? C.teal : C.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: formType === t ? "white" : C.textMuted,
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Row>

              {/* Fecha */}
              <Text style={labelStyle}>Fecha</Text>
              <Row
                style={{
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 9,
                  paddingHorizontal: 12,
                  gap: 8,
                  backgroundColor: C.bg,
                  marginBottom: 14,
                }}
              >
                <Feather name="calendar" size={13} color={C.textMuted} />
                <TextInput
                  value={formDate}
                  onChangeText={setFormDate}
                  placeholder="DD / MM / AAAA"
                  placeholderTextColor={C.textLight}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    fontSize: 13,
                    color: C.text,
                  }}
                />
              </Row>

              {/* Hora */}
              <Text style={labelStyle}>Hora</Text>
              <Row
                style={{
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 9,
                  paddingHorizontal: 12,
                  gap: 8,
                  backgroundColor: C.bg,
                  marginBottom: 14,
                }}
              >
                <Feather name="clock" size={13} color={C.textMuted} />
                <TextInput
                  value={formTime}
                  onChangeText={setFormTime}
                  placeholder="HH:MM AM/PM"
                  placeholderTextColor={C.textLight}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    fontSize: 13,
                    color: C.text,
                  }}
                />
              </Row>

              {/* Notas */}
              <Text style={labelStyle}>Notas adicionales</Text>
              <TextInput
                value={formNotes}
                onChangeText={setFormNotes}
                placeholder="Agrega observaciones o detalles..."
                placeholderTextColor={C.textLight}
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 9,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 13,
                  color: C.text,
                  backgroundColor: C.bg,
                  textAlignVertical: "top",
                  marginBottom: 20,
                  minHeight: 80,
                }}
              />

              {/* Botones */}
              <Row style={{ gap: 10, marginBottom: 4 }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    borderRadius: 9,
                    paddingVertical: 11,
                    alignItems: "center",
                    backgroundColor: C.bg,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  <Text
                    style={{
                      color: C.textMuted,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmAppointment}
                  style={{
                    flex: 2,
                    backgroundColor: C.teal,
                    borderRadius: 9,
                    paddingVertical: 11,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 7,
                  }}
                >
                  <Feather name="check" size={14} color="white" />
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 13 }}
                  >
                    Confirmar cita
                  </Text>
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
  fontSize: 11,
  fontWeight: "700",
  color: C.textSub,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};
