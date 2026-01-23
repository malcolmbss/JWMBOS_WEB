package jwm.svcimpl.calendar;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.hc.client5.http.classic.methods.HttpUriRequestBase;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Summary;

@WebServlet("/events")
public class EventListServlet extends HttpServlet {

        private static final Logger log = Logger.getLogger(EventListServlet.class.getName());
        private HttpServletRequest req;
        private String calendarName;
        // // ---- CONFIG ----
        // private static final String CALDAV_URL = "https://cal.lifefamily.net/public/sw-lifemen/";

        // private static final String USERNAME = "LifeFamilyCalendarAdmin";

        // private static final String PASSWORD = "!!Life.Family@Cals##";

        @Override
        protected void doGet(HttpServletRequest req,
                        HttpServletResponse resp)
                        throws IOException {
                this.req = req;                 calendarName = req.getParameter("calendarName");

                // SSSystem.out.println("Querying events from calendar: " + req.getServletContext().getInitParameter("calDAVcalendarURL")+calendarName);

                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");

                JSONArray events = new JSONArray();

                try {
                        String reportXml = fetchCalendarReport();
                        System.out.println( reportXml );
                        parseReport(reportXml, events);
                } catch (Exception e) {
                        System.out.println( e.getMessage() );
                        log.severe("Event load failed: " + e.getMessage());
                        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
System.out.println( events.toString() );
                try (PrintWriter out = resp.getWriter()) {
                        out.print(events.toString());
                }
        }

        // ------------------------------------------------------------
        // Fetch CalDAV REPORT

        private String fetchCalendarReport() throws IOException {

                String reportBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                                "<c:calendar-query xmlns:d=\"DAV:\" " +
                                "xmlns:c=\"urn:ietf:params:xml:ns:caldav\">\n" +
                                "  <d:prop>\n" +
                                "    <c:calendar-data/>\n" +
                                "  </d:prop>\n" +
                                "  <c:filter>\n" +
                                "    <c:comp-filter name=\"VCALENDAR\">\n" +
                                "      <c:comp-filter name=\"VEVENT\"/>\n" +
                                "    </c:comp-filter>\n" +
                                "  </c:filter>\n" +
                                "</c:calendar-query>";

                HttpUriRequestBase report = new HttpUriRequestBase(
                                "REPORT",
                                URI.create(req.getServletContext().getInitParameter("calDAVcalendarURL")+calendarName));

                report.setHeader("Depth", "1");
                report.setHeader("Content-Type", "text/xml; charset=utf-8");

                String auth = req.getServletContext().getInitParameter("calDAVcalendarAdminID") + ":" + req.getServletContext().getInitParameter("calDAVcalendarAdminPW");
                // System.out.println( auth );
                String encoded = Base64.getEncoder()
                                .encodeToString(auth.getBytes(StandardCharsets.UTF_8));

                report.setHeader("Authorization", "Basic " + encoded);
                report.setEntity(new StringEntity(reportBody, StandardCharsets.UTF_8));

                try (CloseableHttpClient client = HttpClients.createDefault();
                                ClassicHttpResponse response = client.executeOpen(null, report, null)) {

                        try {
                                return EntityUtils.toString(
                                                response.getEntity(),
                                                StandardCharsets.UTF_8);
                        } catch (ParseException pe) {
                                throw new IOException(
                                                "Failed to parse CalDAV response", pe);
                        }
                }
        }

        // ------------------------------------------------------------
        // Parse REPORT → FullCalendar JSON

        private void parseReport(String xml, JSONArray events) {

                try {
                        System.out.println( xml );
                        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                        dbf.setNamespaceAware(true);

                        Document doc = dbf.newDocumentBuilder()
                                        .parse(new InputSource(new StringReader(xml)));

                        NodeList nodes = doc.getElementsByTagNameNS(
                                        "urn:ietf:params:xml:ns:caldav",
                                        "calendar-data");

                        CalendarBuilder builder = new CalendarBuilder();

                        for (int i = 0; i < nodes.getLength(); i++) {

                                String ics = nodes.item(i)
                                                .getTextContent()
                                                .trim();

                                if (!ics.startsWith("BEGIN:VCALENDAR")) {
                                        continue;
                                }

                                try (StringReader reader = new StringReader(ics)) {

                                        Calendar calendar = builder.build(reader);

                                        for (Object o : calendar.getComponents(Component.VEVENT)) {

                                                VEvent event = (VEvent) o;

                                                DtStart start = extract(event, DtStart.DTSTART);
                                                DtEnd end = extract(event, DtEnd.DTEND);
                                                Summary summary = extract(event, Summary.SUMMARY);

                                                JSONObject json = new JSONObject();
                                                json.put("title",
                                                                summary != null
                                                                                ? summary.getValue()
                                                                                : "(no title)");

                                                if (start != null) {
                                                        json.put("start",
                                                                        DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(
                                                                                        start.getDate()));
                                                }

                                                if (end != null) {
                                                        json.put("end",
                                                                        DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(
                                                                                        end.getDate()));
                                                }
// <--- NEW LINE TO PASS UID
if (event.getUid().isPresent()) {
    json.put("id", event.getUid().get().getValue());
}
                                                events.put(json);
                                        }

                                } catch (ParserException pe) {
                                        log.severe(
                                                        "Invalid iCalendar data skipped\n" +
                                                                        pe.getMessage());
                                }
                        }

                } catch (Exception e) {
                        log.severe("REPORT parse failed: " + e.getMessage());
                }
        }

        // ------------------------------------------------------------
        // ical4j 4.x-safe property extraction

        @SuppressWarnings("unchecked")
        private <T extends Property> T extract(VEvent event, String name) {
                Property p = event.getProperty(name).orElse(null);
                return (p != null) ? (T) p : null;
        }
}
