<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page import="jwm.svcimpl.jsp.URLParamtersToEL" %>
<% URLParamtersToEL.bindParamsToRequest(request); %>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Subscribe to Calendar</title>

    <!-- Shared CSS from static JAR -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/responsive-layout.css">

    <!-- Floating dismiss button -->
    <style>
        .dismiss-button {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 1000;
            background-color: #1380c1;
            color: white;
            border: none;
            padding: 10px 14px;
            font-size: 14px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .dismiss-button:hover {
            background-color: #0f6aa0;
        }
    </style>
</head>

<body>

<!-- Floating dismiss button -->
<button class="dismiss-button" onclick="window.close()">✕ Dismiss</button>

<h2>Subscribe to the ${title} Calendar</h2>

<div class="columns">

    <!-- iOS column -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS Logo">
        <h3>iOS</h3>
        <ol>
            <li>Open the Calendar app on your iOS device.</li>
            <li>Click the <strong>Calendars</strong> icon at the bottom.</li>
            <li>In the lower left, click <strong>Add Calendar</strong>.</li>
            <li>Choose <strong>Add Subscription Calendar</strong>.</li>
            <li>Copy/paste this URL:
                <code>${domain}${path}</code>
            </li>
            <li>Click <strong>Subscribe</strong>.</li>
        </ol>
    </div>

    <!-- Android column -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android Logo">
        <h3>Android</h3>
        <ol>
            <li>Open <strong>Settings</strong>.</li>
            <li>Go to <strong>Accounts</strong> (or <strong>Passwords & Accounts</strong>).</li>
            <li>Tap <strong>Add account</strong>.</li>
            <li>Select <strong>CalDAV</strong>.
                <br><em>If missing, install DAVx⁵ from the Play Store.</em>
            </li>
            <li>Server/domain:
                <code>${domain}</code>
            </li>
            <li>Calendar path:
                <code>${path}</code>
            </li>
            <li>Enable syncing in Google Calendar.</li>
        </ol>
    </div>

    <!-- Google Calendar Web -->
    <div class="column">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
             alt="Google Calendar Logo">
        <h3>Google Calendar (Web)</h3>
        <ol>
            <li>Open <strong>Google Calendar</strong>.</li>
            <li>Click <strong>+</strong> next to <strong>Other calendars</strong>.</li>
            <li>Select <strong>From URL</strong>.</li>
            <li>Paste:
                <code>${domain}${path}</code>
            </li>
            <li>Click <strong>Add calendar</strong>.</li>
            <li>The calendar appears under <strong>Other calendars</strong>.</li>
        </ol>
    </div>

</div>

<p>Your calendar will populate shortly with current events; new events will be added automatically.</p>
<p><b>Note:</b> Do <b>not</b> open the URL directly in a browser — it only copies a snapshot and will not update future events.</p>
<p>You can unsubscribe at any time through your calendar application's settings.</p>

</body>
</html>
