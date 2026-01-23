package jwm.svcimpl.jsp;

import java.io.StringReader;
import java.util.Map;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.servlet.http.HttpServletRequest;

public class URLParamtersToEL {

    /**
     * Converts request parameters into request attributes.
     * 1. Flat URL parameters → simple EL variables
     * 2. If parameter looks like JSON object, parses it into JsonObject
     */
    public static void bindParamsToRequest(HttpServletRequest request) {
        if (request == null) return;

        Map<String, String[]> params = request.getParameterMap();

        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            String key = entry.getKey();
            String[] values = entry.getValue();
            if (values != null && values.length > 0) {
                String value = values[0];

                // Try to parse JSON if it looks like an object
                if (value.startsWith("{") && value.endsWith("}")) {
                    try (StringReader reader = new StringReader(value);
                         JsonReader jsonReader = Json.createReader(reader)) {
                        JsonObject obj = jsonReader.readObject();
                        request.setAttribute(key, obj);
                        continue; // parsed as JSON
                    } catch (Exception e) {
                        // fallback to string if JSON parsing fails
                    }
                }

                // Plain string parameter
                request.setAttribute(key, value);
            }
        }
    }
}
