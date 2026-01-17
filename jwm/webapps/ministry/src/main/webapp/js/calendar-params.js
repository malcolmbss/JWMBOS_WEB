/**
 * Generic calendar subscription parameter handler
 *
 * URL parameters:
 *   ?title=LifeMen&domain=https://cal.lifefamily.net&calendar=/public/sw-lifemen/
 *
 * For Android, domain and path are used separately.
 */

function getUrlParam(param) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

// Calendar display title
const calendarTitle = getUrlParam('title') || 'My Calendar';

// Domain (server) portion, e.g. https://cal.lifefamily.net
const calendarDomain = getUrlParam('domain') || 'https://cal.example.com';

// Path portion, e.g. /public/sw-lifemen/
const calendarPath = getUrlParam('calendar') || '/public/default/';

// Full URL (for iOS / Google)
const fullCalendarUrl = calendarDomain + calendarPath;

// Populate elements dynamically
document.addEventListener('DOMContentLoaded', function () {

    // Update all title elements
    const titleElements = document.querySelectorAll('.calendar-title');
    titleElements.forEach(el => el.textContent = calendarTitle);

    // Update all full URL code blocks (iOS / Google)
    const fullUrlElements = document.querySelectorAll('.calendar-url');
    fullUrlElements.forEach(el => el.textContent = fullCalendarUrl);

    // Update Android-specific code blocks (split domain + path)
    const domainElements = document.querySelectorAll('.calendar-domain');
    domainElements.forEach(el => el.textContent = calendarDomain);

    const pathElements = document.querySelectorAll('.calendar-path');
    pathElements.forEach(el => el.textContent = calendarPath);
});
