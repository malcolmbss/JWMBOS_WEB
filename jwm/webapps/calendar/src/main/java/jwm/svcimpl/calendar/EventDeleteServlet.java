package jwm.svcimpl.calendar;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/delete-event")
public class EventDeleteServlet extends HttpServlet {

    private static final String RADICALE_BASE_URL =
            "https://radicale.example.com/user/calendar/";

    private static final String RADICALE_USER = "user";
    private static final String RADICALE_PASS = "password";

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String eventId = req.getParameter("id");

        if (eventId == null || eventId.isBlank()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing event id");
            return;
        }

        String eventUrl = RADICALE_BASE_URL + eventId + ".ics";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(eventUrl))
                .DELETE()
                .header("Authorization", basicAuth())
                .build();

        try {
            HttpResponse<Void> response =
                    CalDavClient.CLIENT.send(request, HttpResponse.BodyHandlers.discarding());

            if (response.statusCode() == 204 || response.statusCode() == 200) {
                resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            } else {
                resp.sendError(HttpServletResponse.SC_BAD_GATEWAY,
                        "Radicale delete failed: " + response.statusCode());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ServletException(e);
        }
    }

    private String basicAuth() {
        String auth = RADICALE_USER + ":" + RADICALE_PASS;
        return "Basic " + Base64.getEncoder()
                .encodeToString(auth.getBytes(StandardCharsets.UTF_8));
    }
}
