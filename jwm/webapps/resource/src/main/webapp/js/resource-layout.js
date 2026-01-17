(function () {

    const eventFrame = document.getElementById("eventFrame");

    window.addEventListener("message", function (event) {

        // Optional origin check later
        // if (event.origin !== "https://yourdomain") return;

        if (!event.data || event.data.type !== "calendar-event-click") {
            return;
        }

        const eventId = event.data.eventId;
        if (!eventId) return;

        eventFrame.src =
            "/event-war/event.jsp?eventId=" + encodeURIComponent(eventId);
    });

})();
