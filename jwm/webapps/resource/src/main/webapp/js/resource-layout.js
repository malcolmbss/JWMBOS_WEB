(function () {

    /* ---------------------------
       Split-pane resizing
    ---------------------------- */

    const divider = document.querySelector(".divider");
    const left = document.querySelector(".left");
    const layout = document.querySelector(".layout");

    let isDragging = false;

    divider.addEventListener("mousedown", () => {
        isDragging = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const rect = layout.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;

        const minLeft = 280;
        const maxLeft = rect.width - 320;

        if (newWidth >= minLeft && newWidth <= maxLeft) {
            left.style.flexBasis = newWidth + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    });

    /* ---------------------------
       Calendar → Event panel
    ---------------------------- */

    const eventFrame = document.getElementById("eventFrame");

    window.addEventListener("message", function (event) {

        if (!event.data || event.data.type !== "calendar-event-click") {
            return;
        }

        const eventId = event.data.eventId;
        if (!eventId) return;

        eventFrame.src =
            "/event/jsp/event-details.jsp?eventId=" +
            encodeURIComponent(eventId);
    });

})();
