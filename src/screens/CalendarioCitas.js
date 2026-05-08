import { useState } from "react";
import { Alert, View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import C from "../constants/colors";
import { Row, Card, Badge } from "../components";

// December 2024: 31 days, starts on Sunday (index 0)
// But per spec: starts on Saturday = index 6
const MONTH_NAME = "Diciembre 2024";
const DAYS_IN_MONTH = 31;
const START_DAY = 6; // Saturday

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

const EVENTS = {
  5:  [{ label: "Asesoría grupal",      color: C.blue,   bg: C.blueLight }],
  10: [{ label: "Entrega Reporte P3",   color: C.red,    bg: C.redLight }],
  15: [{ label: "Vencimiento reporte",  color: C.amber,  bg: C.amberLight }],
  18: [{ label: "Cita Dr. Martínez",   color: C.purple, bg: C.purpleLight }],
  20: [{ label: "Revisión de avances",  color: C.teal,   bg: C.tealLight }],
  27: [{ label: "Evaluación final",     color: C.green,  bg: C.greenLight }],
};

const UPCOMING = [
  {
    day: 10,
    month: "Dic",
    title: "Entrega Reporte Parcial 3",
    time: "Todo el día",
    color: C.red,
    bg: C.redLight,
    icon: "file-text",
  },
  {
    day: 15,
    month: "Dic",
    title: "Vencimiento convenio SoftSolutions",
    time: "23:59",
    color: C.amber,
    bg: C.amberLight,
    icon: "alert-triangle",
  },
  {
    day: 18,
    month: "Dic",
    title: "Cita con Dr. Martínez",
    time: "10:00 AM · Sala 204",
    color: C.purple,
    bg: C.purpleLight,
    icon: "user",
  },
  {
    day: 20,
    month: "Dic",
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
  const [selected, setSelected] = useState(18);
  const [monthDate, setMonthDate] = useState(new Date(2024, 11, 1));
  const [events, setEvents] = useState({ "2024-11": EVENTS });
  const [upcoming, setUpcoming] = useState(UPCOMING);
  const [formType, setFormType] = useState("Asesoría");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const monthName = `${MONTHS[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  const currentEvents = events[monthKey(monthDate)] || {};
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = monthDate.getMonth() === 11 && monthDate.getFullYear() === 2024 ? 7 : null;

  const changeMonth = (delta) => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setSelected(null);
  };

  const startNewAppointment = () => {
    setFormDate("");
    setFormTime("");
    setFormNotes("");
  };

  const confirmAppointment = () => {
    const match = formDate.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (!match || !formTime.trim()) {
      Alert.alert("Datos incompletos", "Captura fecha con formato DD/MM/AAAA y hora.");
      return;
    }

    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const date = new Date(year, month, day);

    if (date.getMonth() !== month || date.getDate() !== day) {
      Alert.alert("Fecha invalida", "Revisa la fecha de la cita.");
      return;
    }

    const title = formNotes.trim() || formType;
    const newEvent = { label: title, color: C.teal, bg: C.tealLight };
    const appointmentDate = new Date(year, month, 1);
    const appointmentKey = monthKey(appointmentDate);
    setEvents((prev) => ({
      ...prev,
      [appointmentKey]: {
        ...(prev[appointmentKey] || {}),
        [day]: [...(prev[appointmentKey]?.[day] || []), newEvent],
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
    setMonthDate(appointmentDate);
    setSelected(day);
    setFormDate("");
    setFormTime("");
    setFormNotes("");
    Alert.alert("Cita agendada", "La cita se agrego al calendario.");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>Calendario de Citas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Agenda y gestión de reuniones</Text>
        </View>
        <TouchableOpacity
          onPress={startNewAppointment}
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
          <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Nueva Cita</Text>
        </TouchableOpacity>
      </Row>

      <Row style={{ gap: 18, alignItems: "flex-start" }}>
        {/* Left: Calendar */}
        <View style={{ flex: 1 }}>
          <Card style={{ marginBottom: 16 }}>
            {/* Month nav */}
            <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
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
              <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }}>{monthName}</Text>
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
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.textMuted }}>{wd}</Text>
                </View>
              ))}
            </Row>

            {/* Calendar grid */}
            <View>
              {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
                <Row key={rowIdx} style={{ marginBottom: 4 }}>
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
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
                                fontWeight: isSelected || isToday ? "800" : "500",
                                color: isSelected ? "white" : isToday ? C.teal : C.text,
                                marginBottom: 3,
                              }}
                            >
                              {day}
                            </Text>
                            {hasEvent && (
                              <View style={{ gap: 2, alignItems: "center" }}>
                                {currentEvents[day].slice(0, 2).map((ev, ei) => (
                                  <View
                                    key={ei}
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: 3,
                                      backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : ev.color,
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
                  {/* Pad last row */}
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).length < 7 &&
                    Array.from({ length: 7 - cells.slice(rowIdx * 7, rowIdx * 7 + 7).length }).map((_, pi) => (
                      <View key={`pad-${pi}`} style={{ flex: 1 }} />
                    ))}
                </Row>
              ))}
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
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "white" }}>{selected}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.text }}>
                    {selected} de {monthName}
                  </Text>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    {currentEvents[selected] ? `${currentEvents[selected].length} evento(s)` : "Sin eventos"}
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
                    <Text style={{ fontSize: 13, fontWeight: "700", color: ev.color, flex: 1 }}>
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
                  <Feather name="calendar" size={22} color={C.textLight} style={{ marginBottom: 6 }} />
                  <Text style={{ fontSize: 12, color: C.textMuted }}>No hay eventos este día</Text>
                </View>
              )}
            </Card>
          )}
        </View>

        {/* Right Sidebar */}
        <View style={{ width: 290 }}>
          {/* Upcoming appointments */}
          <Card style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.text, marginBottom: 14 }}>
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
                  {/* Date bubble */}
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
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "white", lineHeight: 16 }}>
                      {ev.day}
                    </Text>
                    <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
                      {ev.month}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontSize: 12, fontWeight: "700", color: ev.color, marginBottom: 2 }}
                      numberOfLines={2}
                    >
                      {ev.title}
                    </Text>
                    <Row style={{ alignItems: "center", gap: 4 }}>
                      <Feather name="clock" size={10} color={ev.color} style={{ opacity: 0.7 }} />
                      <Text style={{ fontSize: 10, color: ev.color, opacity: 0.8 }}>{ev.time}</Text>
                    </Row>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Schedule form */}
          <Card>
            <Text style={{ fontSize: 13, fontWeight: "800", color: C.text, marginBottom: 14 }}>
              Agendar Cita
            </Text>

            {/* Type selector */}
            <Text style={labelStyle}>Tipo de cita</Text>
            <Row style={{ flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {FORM_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setFormType(t)}
                  style={{
                    paddingHorizontal: 11,
                    paddingVertical: 5,
                    borderRadius: 20,
                    backgroundColor: formType === t ? C.teal : C.bg,
                    borderWidth: 1,
                    borderColor: formType === t ? C.teal : C.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: formType === t ? "white" : C.textMuted,
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>

            {/* Date input */}
            <Text style={labelStyle}>Fecha</Text>
            <Row
              style={{
                alignItems: "center",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                paddingHorizontal: 11,
                gap: 8,
                backgroundColor: C.bg,
                marginBottom: 12,
              }}
            >
              <Feather name="calendar" size={13} color={C.textMuted} />
              <TextInput
                value={formDate}
                onChangeText={setFormDate}
                placeholder="DD / MM / AAAA"
                placeholderTextColor={C.textLight}
                style={{ flex: 1, paddingVertical: 9, fontSize: 13, color: C.text }}
              />
            </Row>

            {/* Time input */}
            <Text style={labelStyle}>Hora</Text>
            <Row
              style={{
                alignItems: "center",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                paddingHorizontal: 11,
                gap: 8,
                backgroundColor: C.bg,
                marginBottom: 12,
              }}
            >
              <Feather name="clock" size={13} color={C.textMuted} />
              <TextInput
                value={formTime}
                onChangeText={setFormTime}
                placeholder="HH:MM AM/PM"
                placeholderTextColor={C.textLight}
                style={{ flex: 1, paddingVertical: 9, fontSize: 13, color: C.text }}
              />
            </Row>

            {/* Notes input */}
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
                paddingHorizontal: 11,
                paddingVertical: 9,
                fontSize: 13,
                color: C.text,
                backgroundColor: C.bg,
                textAlignVertical: "top",
                marginBottom: 16,
                minHeight: 72,
              }}
            />

            {/* Submit */}
            <TouchableOpacity
              onPress={confirmAppointment}
              style={{
                backgroundColor: C.teal,
                borderRadius: 9,
                paddingVertical: 11,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Feather name="calendar" size={14} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>Confirmar Cita</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Row>
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
