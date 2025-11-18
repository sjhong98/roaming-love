import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

type DayCell = {
    date: Date;
    type: "prev" | "current" | "next";
};

type DateRange = {
    startDate: string | null;
    endDate: string | null;
};

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const compareDateStrings = (a: string, b: string) => {
    return new Date(a).getTime() - new Date(b).getTime();
};

const generateCalendarMatrix = (year: number, month: number): DayCell[][] => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const matrix: DayCell[][] = [];
    let currentDay = 1;
    let nextMonthDay = 1;
    let prevMonthStart = daysInPrevMonth - firstWeekDay + 1;

    for (let week = 0; week < 6; week++) {
        const weekRow: DayCell[] = [];
        for (let weekday = 0; weekday < 7; weekday++) {
            if (week === 0 && weekday < firstWeekDay) {
                weekRow.push({
                    date: new Date(year, month - 1, prevMonthStart++),
                    type: "prev",
                });
            } else if (currentDay <= daysInMonth) {
                weekRow.push({
                    date: new Date(year, month, currentDay++),
                    type: "current",
                });
            } else {
                weekRow.push({
                    date: new Date(year, month + 1, nextMonthDay++),
                    type: "next",
                });
            }
        }
        matrix.push(weekRow);
        if (currentDay > daysInMonth && nextMonthDay > 7) {
            break;
        }
    }

    return matrix;
};

export default function DateSelect({
    setDateSelectOpen,
    dateRange,
    setDateRange,
}: {
    setDateSelectOpen: (open: boolean) => void;
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
}) {
    const initialDate = dateRange?.startDate ? new Date(dateRange.startDate) : new Date();
    const [range, setRange] = useState<DateRange>({
        startDate: dateRange?.startDate ?? null,
        endDate: dateRange?.endDate ?? null,
    });
    const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());

    useEffect(() => {
        if (dateRange?.startDate) {
            const parsed = new Date(dateRange.startDate);
            if (!Number.isNaN(parsed.getTime())) {
                setRange({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate ?? null,
                });
                setCurrentYear(parsed.getFullYear());
                setCurrentMonth(parsed.getMonth());
            }
        } else {
            setRange({ startDate: null, endDate: null });
        }
    }, [dateRange?.startDate, dateRange?.endDate]);

    const calendarMatrix = useMemo(() => generateCalendarMatrix(currentYear, currentMonth), [currentYear, currentMonth]);
    const todayString = useMemo(() => formatDate(new Date()), []);

    const goToMonth = (year: number, month: number) => {
        if (month < 0) {
            setCurrentMonth(11);
            setCurrentYear(year - 1);
        } else if (month > 11) {
            setCurrentMonth(0);
            setCurrentYear(year + 1);
        } else {
            setCurrentMonth(month);
            setCurrentYear(year);
        }
    };

    const handlePrevMonth = () => {
        const newMonth = currentMonth - 1;
        const newYear = newMonth < 0 ? currentYear - 1 : currentYear;
        goToMonth(newYear, (newMonth + 12) % 12);
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth + 1;
        const newYear = newMonth > 11 ? currentYear + 1 : currentYear;
        goToMonth(newYear, newMonth % 12);
    };

    const handleDayPress = (day: Date, type: DayCell['type']) => {
        const formatted = formatDate(day);
        let newRange: DateRange;

        if (!range.startDate || (range.startDate && range.endDate)) {
            newRange = { startDate: formatted, endDate: null };
        } else if (range.startDate && !range.endDate) {
            const start = range.startDate;
            if (compareDateStrings(formatted, start) < 0) {
                newRange = { startDate: formatted, endDate: start };
            } else if (compareDateStrings(formatted, start) === 0) {
                newRange = { startDate: formatted, endDate: null };
            } else {
                newRange = { startDate: start, endDate: formatted };
            }
        } else {
            newRange = { startDate: formatted, endDate: null };
        }

        setRange(newRange);
        setDateRange(newRange);

        if (type === "prev" || type === "next") {
            goToMonth(day.getFullYear(), day.getMonth());
        }
    };

    const handleReset = () => {
        const cleared = { startDate: null, endDate: null };
        setRange(cleared);
        setDateRange(cleared);
    };

    const monthTitle = useMemo(() => {
        const date = new Date(currentYear, currentMonth, 1);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }, [currentMonth, currentYear]);

    return (
        <View style={{ width: '100%', paddingHorizontal: 24, position: 'relative', marginTop: -10 }}>
            <View style={styles.view}>
                <View style={styles.view2}>
                    <View style={[styles.view3, styles.viewPosition]} />
                </View>
                <View style={{ paddingHorizontal: 16, paddingVertical: 29 }}>
                    <Text style={styles.text}>여행 날짜는 언제인가요?</Text>
                </View>
                <View style={styles.calendar}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
                            <Text style={styles.monthButtonText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{monthTitle}</Text>
                        <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
                            <Text style={styles.monthButtonText}>›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.weekRow}>
                        {dayNames.map((day) => (
                            <Text key={day} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>
                    {calendarMatrix.map((week, weekIndex) => (
                        <View key={weekIndex} style={styles.weekRow}>
                            {week.map(({ date: dayDate, type }) => {
                                const formatted = formatDate(dayDate);
                                const isInactive = type !== 'current';
                                const isToday = formatted === todayString;
                                const isRangeStart = range.startDate === formatted;
                                const isRangeEnd = range.endDate === formatted;
                                const showRangeStart = isRangeStart && !!range.endDate;
                                const showRangeEnd = isRangeEnd && !!range.startDate;
                                const isInRange =
                                    range.startDate &&
                                    range.endDate &&
                                    compareDateStrings(formatted, range.startDate) > 0 &&
                                    compareDateStrings(formatted, range.endDate) < 0;
                                return (
                                    <TouchableOpacity
                                        key={`${weekIndex}-${formatted}`}
                                        style={[
                                            styles.dayCell,
                                            isInRange && styles.dayCellInRange,
                                            showRangeStart && styles.dayCellRangeStart,
                                            showRangeEnd && styles.dayCellRangeEnd,
                                        ]}
                                        onPress={() => handleDayPress(dayDate, type)}
                                        activeOpacity={0.8}
                                    >
                                        <View
                                            style={[
                                                styles.dayInner,
                                                (isRangeStart || isRangeEnd) && styles.dayInnerSelected,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.dayText,
                                                    isInactive && styles.dayTextInactive,
                                                    (isRangeStart || isRangeEnd) && styles.dayTextSelected,
                                                ]}
                                            >
                                                {dayDate.getDate()}
                                            </Text>
                                        </View>
                                        {!isRangeStart && !isRangeEnd && isToday && <View style={styles.todayDot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
                <View style={{ paddingHorizontal: 16, marginTop: -10 }}>
                    <View style={styles.bottomActions}>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={styles.resetText}>재설정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (!range.startDate || !range.endDate) && styles.confirmButtonDisabled,
                            ]}
                            onPress={() => {
                                if (!range.startDate || !range.endDate) return;
                                setDateSelectOpen(false);
                            }}
                            disabled={!range.startDate || !range.endDate}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmButtonText}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    viewPosition: {
        borderRadius: 20,
        width: '100%',
        top: 0,
        position: "absolute",
        height: Dimensions.get('window').width * 1.13,
    },
    view: {
        width: "100%",
        height: Dimensions.get('window').width * 1.13,
        flex: 1
    },
    view2: {
        width: '100%',
        top: 0,
        position: "absolute",
        height: Dimensions.get('window').width * 1.13,
    },
    view3: {
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.15)",
        elevation: 9.1,
        backgroundColor: "#fff",
        height: 450,
    },
    view4: {
        // backgroundColor: "rgba(255, 255, 255, 0)",
        borderStyle: "solid",
        borderColor: "#999",
        height: Dimensions.get('window').height - 140,
    },
    text: {
        fontSize: 20,
        fontWeight: "700",
        fontFamily: "NanumSquare Neo",
        color: "#141414",
        textAlign: "left",
        marginBottom: 16,
    },
    calendar: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        marginTop: -30
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 0,
    },
    monthButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    monthButtonText: {
        fontSize: 20,
        color: '#FF2D55',
        fontWeight: '600',
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#141414',
        fontFamily: "NanumSquare Neo",
    },
    weekRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        fontFamily: "NanumSquare Neo",
    },
    dayCell: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 20,
        marginVertical: 4,
        marginHorizontal: 0,
        position: 'relative',
        overflow: 'hidden',
        marginTop: -5,
        marginBottom: -10,
    },
    dayCellInRange: {
        backgroundColor: '#FFE3EB',
    },
    dayCellRangeStart: {
        backgroundColor: '#FFE3EB',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    dayCellRangeEnd: {
        backgroundColor: '#FFE3EB',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    dayInner: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayInnerSelected: {
        backgroundColor: '#FF2D55',
    },
    dayText: {
        fontSize: 14,
        color: '#141414',
        fontFamily: "NanumSquare Neo",
        fontWeight: '500',
    },
    dayTextInactive: {
        color: '#CCC',
    },
    dayTextSelected: {
        color: '#FFF',
        fontWeight: '700',
    },
    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF2D55',
        marginTop: 4,
        position: 'absolute',
        bottom: 6,
    },
    bottomActions: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resetText: {
        fontSize: 14,
        color: '#999',
        fontFamily: "NanumSquare Neo",
        textDecorationLine: 'underline',
    },
    confirmButton: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 10,
    },
    confirmButtonDisabled: {
        backgroundColor: '#FFD1DD',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: "NanumSquare Neo",
    },
});