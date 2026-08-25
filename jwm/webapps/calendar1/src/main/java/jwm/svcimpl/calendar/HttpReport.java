package jwm.svcimpl.calendar;

import java.net.URI;

import org.apache.hc.client5.http.classic.methods.HttpUriRequestBase;

public class HttpReport extends HttpUriRequestBase {

    public static final String METHOD_NAME = "REPORT";

    public HttpReport(final URI uri) {
        super(METHOD_NAME, uri);
    }
}
