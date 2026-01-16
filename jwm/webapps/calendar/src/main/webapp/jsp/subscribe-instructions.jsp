<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Subscribe to Calendar</title>

    <!-- Shared CSS from static JAR -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/responsive-layout.css">

    <!-- Calendar JS specific to this webapp -->
    <script src="${pageContext.request.contextPath}/js/calendar-params.js"></script>
</head>

<body>

<h2 class="calendar-title">Loading calendar...</h2>

<div class="columns">

    <!-- iOS column -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS Logo">
        <h3>iOS</h3>
        <ol>
            <li>Open the Calendar app on your iOS device.</li>
            <li>Click the 'Calendars' icon at the bottom of the main page.</li>
            <li>In the lower left, click "Add Calendar".</li>
            <li>Choose "Add Subscription Calendar".</li>
            <li>Copy/paste this URL into the subscription field: 
                <code class="calendar-url"></code>
            </li>
            <li>Click "Subscribe" to complete.</li>
        </ol>
    </div>

    <!-- Android column -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android Logo">
        <h3>Android</h3>
        <ol>
            <li>Open <strong>Settings</strong> on your Android device.</li>
            <li>Go to <strong>Accounts</strong> (or <strong>Passwords & Accounts</strong>).</li>
            <li>Tap <strong>Add account</strong>.</li>
            <li>Select <strong>CalDAV</strong>.
                <br><em>If CalDAV is missing, install an app such as DAVx⁵ from the Play Store.</em>
            </li>
            <li>Server/domain:
                <code class="calendar-domain"></code>
            </li>
            <li>Calendar path:
                <code class="calendar-path"></code>
            </li>
            <li>Open the Google Calendar app and enable syncing for this calendar.</li>
        </ol>
    </div>

    <!-- Google Calendar Web -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
             alt="Google Calendar Logo">
        <h3>Google Calendar (Web)</h3>
        <ol>
            <li>Open <strong>Google Calendar</strong> in a browser.</li>
            <li>Click the <strong>+</strong> next to <strong>Other calendars</strong>.</li>
            <li>Select <strong>From URL</strong>.</li>
            <li>Paste the URL:
                <code class="calendar-url"></code>
            </li>
            <li>Click <strong>Add calendar</strong>.</li>
            <li>The calendar will appear under <strong>Other calendars</strong>.</li>
        </ol>
    </div>

</div>

<p>Your calendar will populate shortly with current events; new events will be added automatically.</p>
<p><b>Note:</b> Do <b>not</b> open the URL directly in a browser — it only copies a snapshot and will not update future events.</p>
<p>You can unsubscribe at any time through your calendar application's settings.</p>

<div class="footer">
    <button onclick="window.close()">Dismiss</button>
</div>

</body>
</html>
