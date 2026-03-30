/**
 * GHL Form Bridge — Shadow/Mirror Pattern
 *
 * Syncs the custom visible form to a hidden GHL (GoHighLevel) form so that
 * CRM pipelines, workflows, and automations fire correctly on submission.
 *
 * HOW TO SET UP:
 * 1. In GHL, go to Sites → Forms → your form → Embed
 * 2. Copy the embed code and paste it inside the .ghl-form-hidden div
 * 3. Inspect the hidden GHL form fields in DevTools to find their `name` attributes
 * 4. Update the FIELD_MAP below with the actual GHL field names
 *
 * GHL field names typically look like: "first_name", "email", "phone",
 * or for custom fields: "customField_XXXXXXXX"
 */

(function () {
    'use strict';

    // TODO: Replace right-hand values with actual GHL form field name attributes
    // To find them: embed the GHL form, then open DevTools → inspect the hidden form inputs
    const FIELD_MAP = {
        'visible-first-name': 'first_name',    // TODO: verify
        'visible-last-name':  'last_name',     // TODO: verify
        'visible-email':      'email',         // TODO: verify
        'visible-phone':      'phone',         // TODO: verify
        'visible-org':        'company_name',  // TODO: verify — may be "companyName" or custom
        'visible-message':    'message',       // TODO: verify — may be a custom field
        'visible-event-date': 'event_date',    // TODO: verify — likely a custom field
        'visible-source':     'lead_source',   // TODO: verify
    };

    function syncField(visibleId, ghlName) {
        const visible = document.getElementById(visibleId);
        const ghlField = document.querySelector(`.ghl-form-hidden [name="${ghlName}"]`);
        if (!visible || !ghlField) return;

        visible.addEventListener('input', () => {
            ghlField.value = visible.value;
            ghlField.dispatchEvent(new Event('input',  { bubbles: true }));
            ghlField.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    function initFormBridge() {
        const visibleForm = document.querySelector('.quote-form');
        const ghlForm = document.querySelector('.ghl-form-hidden form');

        // Graceful no-op: if either form isn't on this page, do nothing
        if (!visibleForm || !ghlForm) return;

        // Wire up each field pair
        Object.entries(FIELD_MAP).forEach(([visibleId, ghlName]) => {
            syncField(visibleId, ghlName);
        });

        // On visible form submit → final sync → trigger GHL submission
        visibleForm.addEventListener('submit', e => {
            e.preventDefault();

            // Final sync pass
            Object.entries(FIELD_MAP).forEach(([visibleId, ghlName]) => {
                const visible = document.getElementById(visibleId);
                const ghl = document.querySelector(`.ghl-form-hidden [name="${ghlName}"]`);
                if (visible && ghl) {
                    ghl.value = visible.value;
                    ghl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });

            // Trigger GHL form
            const submitBtn = ghlForm.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            } else {
                ghlForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initFormBridge);

})();
