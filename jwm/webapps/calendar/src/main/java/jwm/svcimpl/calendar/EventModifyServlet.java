package jwm.svcimpl.calendar;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/modify-event")
public class EventModifyServlet extends HttpServlet {

    private static final String RADICALE_BASE_URL =
            "https://radicale.example.com/user/calendar/";

    private static final String RADICALE_USER = "user";
    private static final String RADICALE_PASS = "password";

    private static final DateTimeFormatter ICS_DATE =
            DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String id = req.getParameter("id");
        String title = req.getParameter("title");
        String start = req.getParameter("start");
        String end = req.getParameter("end");

        if (id == null || title == null || start == null || end == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing parameters");
            return;
        }

        ZonedDateTime startTime = ZonedDateTime.parse(start);
        ZonedDateTime endTime = ZonedDateTime.parse(end);

        String icsBody = buildIcs(id, title, startTime, endTime);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RADICALE_BASE_URL + id + ".ics"))
                .header("Authorization", basicAuth())
                .header("Content-Type", "text/calendar; charset=utf-8")
                .PUT(HttpRequest.BodyPublishers.ofString(icsBody))
                .build();

        try {
            HttpResponse<Void> response =
                    CalDavClient.CLIENT.send(request, HttpResponse.BodyHandlers.discarding());

            if (response.statusCode() == 201 || response.statusCode() == 204) {
                resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            } else {
                resp.sendError(HttpServletResponse.SC_BAD_GATEWAY,
                        "Radicale update failed: " + response.statusCode());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ServletException(e);
        }
    }

    private String buildIcs(String uid, String title,
                            ZonedDateTime start, ZonedDateTime end) {

        return """
                BEGIN:VCALENDAR
                VERSION:2.0
                PRODID:-//YourApp//Calendar//EN
                BEGIN:VEVENT
                UID:%s
                DTSTAMP:%s
                DTSTART:%s
                DTEND:%s
                SUMMARY:%s
                END:VEVENT
                END:VCALENDAR
                """.formatted(
                uid,
                ICS_DATE.format(ZonedDateTime.now()),
                ICS_DATE.format(start),
                ICS_DATE.format(end),
                escape(title)
        );
    }

    private String escape(String text) {
        return text.replace("\\", "\\\\")
                   .replace(";", "\\;")
                   .replace(",", "\\,")
                   .replace("\n", "\\n");
    }

    private String basicAuth() {
        String auth = RADICALE_USER + ":" + RADICALE_PASS;
        return "Basic " + Base64.getEncoder()
                .encodeToString(auth.getBytes(StandardCharsets.UTF_8));
    }
}
