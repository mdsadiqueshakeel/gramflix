package com.example.referralwallet.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class DateUtil {
    public static Date now() {
        return Date.from(Instant.now());
    }

    public static Date plusMinutes(int minutes) {
        return Date.from(Instant.now().plusSeconds(minutes * 60L));
    }

    public static boolean isBeforeNow(Date d) {
        if (d == null) return true;
        return d.before(new Date());
    }

    public static LocalDate toLocalDate(Date d) {
        return Instant.ofEpochMilli(d.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
