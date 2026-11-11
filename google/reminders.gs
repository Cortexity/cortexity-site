/**
 * Free replacement for Calendly's paid email reminders.
 *
 * Every 15 minutes, looks in this Google account's calendar for "Cortexity Intro Call"
 * events and emails each guest twice: ~24 hours before and ~1 hour before.
 * Each reminder is sent once per event (tracked with event tags).
 *
 * Setup (once):
 *   1. Paste this file into the same Apps Script project as apps-script.gs (+ → Script → "reminders").
 *   2. Select the function `installReminderTrigger` in the toolbar and click Run. Approve the
 *      Calendar + Gmail permissions.
 *   3. Done. To test without waiting, run `testReminderScan` (logs what it would send, sends nothing).
 */

var REMINDER_TITLE = "Cortexity Intro Call"; // matches the Calendly event name (case-insensitive "contains")
var REMINDER_FROM_NAME = "Joseph at Cortexity";
var REMINDER_WINDOWS = [
  { tag: "cx_rem_24h", label: "tomorrow" },
  { tag: "cx_rem_1h", label: "in 1 hour" },
];

function installReminderTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sendReminders") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("sendReminders").timeBased().everyMinutes(15).create();
  sendReminders();
}

function sendReminders() { scan_(false); }
function testReminderScan() { scan_(true); }

function scan_(dryRun) {
  var now = new Date();
  var until = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  var me = Session.getEffectiveUser().getEmail().toLowerCase();
  var events = CalendarApp.getDefaultCalendar().getEvents(now, until);

  events.forEach(function (ev) {
    if (ev.getTitle().toLowerCase().indexOf(REMINDER_TITLE.toLowerCase()) === -1) return;
    var minsAway = (ev.getStartTime().getTime() - now.getTime()) / 60000;

    // 1h reminder: call starts within the next hour. 24h reminder: call starts 23–24h from now
    // (calls booked less than 23h ahead skip it; they only just got the invite).
    var win = null;
    if (minsAway > 0 && minsAway <= 60) win = REMINDER_WINDOWS[1];
    else if (minsAway > 23 * 60 && minsAway <= 24 * 60) win = REMINDER_WINDOWS[0];
    if (!win || ev.getTag(win.tag)) return;

    var guests = ev.getGuestList().map(function (g) { return g.getEmail(); })
      .filter(function (e) { return e && e.toLowerCase() !== me && e.toLowerCase().indexOf("cortexity.studio") === -1; });
    if (!guests.length) return;

    var tz = Session.getScriptTimeZone();
    var when = Utilities.formatDate(ev.getStartTime(), tz, "EEEE d MMMM, HH:mm") + " (" + tz + ")";
    var subject = win.tag === "cx_rem_1h"
      ? "Starting in 1 hour: your Cortexity call"
      : "Tomorrow: your Cortexity call";
    var body =
      "Hi,\n\n" +
      "A quick reminder that our call about your app is " + win.label + ":\n" +
      when + "\n\n" +
      "Join with the Google Meet link in your calendar invite.\n\n" +
      "Can't make it? Reply to this email and we'll find another time.\n\n" +
      "Joseph\nCortexity";

    guests.forEach(function (to) {
      if (dryRun) Logger.log("[dry run] " + subject + " → " + to + " (" + Math.round(minsAway) + " min away)");
      else GmailApp.sendEmail(to, subject, body, { name: REMINDER_FROM_NAME });
    });
    if (!dryRun) ev.setTag(win.tag, new Date().toISOString());
  });
}
