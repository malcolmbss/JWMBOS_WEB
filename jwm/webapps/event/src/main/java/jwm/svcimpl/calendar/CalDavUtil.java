package jwm.svcimpl.calendar;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CalDavUtil {

    private static final Pattern VCALENDAR = Pattern.compile("BEGIN:VCALENDAR[\\s\\S]*?END:VCALENDAR");

    public static List<String> extractCalendars(String xml) {

        List<String> calendars = new ArrayList<>();
        Matcher matcher = VCALENDAR.matcher(xml);

        while (matcher.find()) {
            calendars.add(matcher.group());
        }

        return calendars;
    }

    public static String getContextVariable(String aName) {
        return (null);
    }
}
