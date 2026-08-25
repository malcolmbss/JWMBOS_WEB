package jwm.svcimpl.calendar;

import java.net.http.HttpClient;
import java.time.Duration;

public final class CalDavClient {

    public static final HttpClient CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private CalDavClient() {}
}
