package jwm.svcimpl.calendar;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.ComponentList;
import net.fortuna.ical4j.model.PropertyList;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.model.property.Version;

@WebServlet("/createEvent")
public class EventCreateServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        // Read JSON body
        String bodyText = req.getReader()
                .lines()
                .collect(Collectors.joining());

        JSONObject body = new JSONObject(bodyText);
        try {
            PropertyList properties = new PropertyList();
            ZonedDateTime start = ZonedDateTime.parse(body.getString("start"));
            ZonedDateTime end = ZonedDateTime.parse(body.getString("end"));

            // JWM: VERY Convoluted requirement... add(..) creates a new instance, but is
            // defined to return an interface (???) This works:
            // This is iCal4j.... not my code. I have no control over this requirement
            // even ChatGPT couldn't figure it out.... I had to go old school.... :-(
            properties = (PropertyList) properties.add(new DtStart<>(start.toInstant()));
            properties = (PropertyList) properties.add(new DtEnd<>(end.toInstant()));
            properties = (PropertyList) properties.add(new Summary(body.getString("title")));
            properties = (PropertyList) properties.add(new Uid(UUID.randomUUID().toString()));

            VEvent event = new VEvent(properties);

            // Build VCALENDAR
            PropertyList calProperties = new PropertyList();

            Version version = new Version();
            version.setValue("2.0");
            calProperties = (PropertyList) calProperties.add(version);

            CalScale calScale = new CalScale();
            calScale.setValue("GREGORIAN");
            calProperties = (PropertyList) calProperties.add(calScale);
            calProperties = (PropertyList) calProperties.add(new ProdId("-//FullCalendar Radicale Demo//EN"));

            ComponentList<VEvent> components = new ComponentList<>();
            components = (ComponentList<VEvent>) components.add(event);

            Calendar calendar = new Calendar(components);
            calendar.setPropertyList(calProperties);

            // Serialize the calendar
            CalendarOutputter outputter = new CalendarOutputter();
            StringWriter stringWriter = new StringWriter();
            outputter.output(calendar, stringWriter);
            String icsData = stringWriter.toString();

            // PUT to Radicale (each event = its own resource)
            URL url = URI.create(
                    CalDavUtil.getContextVariable( "calDAVcalendarURL")
                            + event.getUid().get().getValue()
                            + ".ics")
                    .toURL();

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("PUT");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "text/calendar; charset=utf-8");
            conn.setRequestProperty("Authorization", basicAuth());

            // Write the calendar to the request body
            try (OutputStream os = conn.getOutputStream()) {
                os.write(icsData.getBytes(StandardCharsets.UTF_8));

                int responseCode = conn.getResponseCode();
                if (responseCode != 201 && responseCode != 204) {
                    throw new IOException("Radicale returned HTTP " + responseCode);
                }
                resp.setStatus(HttpServletResponse.SC_CREATED);
            }

        } catch (IOException | org.json.JSONException e) {
            System.err.println(e);
        }
    }

    private String basicAuth() {
        return "Basic " + Base64.getEncoder()
                .encodeToString((CalDavUtil.getContextVariable( "calDAVcalendarAdminID") + ":" + CalDavUtil.getContextVariable( "calDAVcalendarAdminPW")).getBytes(StandardCharsets.UTF_8));       
    }
}
