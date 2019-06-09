export default (function () {
    
    const events = {};

    class EventBus {
        static listenTo(evt, fn, context) {
            if (!events[evt]) {
                events[evt] = [];
            }
            events[evt].push({ context: context || this, callback: fn });
        }

        static listenToOnce(evt, fn, context) {
            if (!events[evt]) {
                events[evt] = [];
            }
            events[evt].push({
                context: context || this,
                callback: fn,
                once: true
            });
        }

        static broadcast(evt, ...args) {
            if (!events[evt]) {
                return false;
            }
            
            events[evt].forEach((subscription) => {
                subscription.callback.apply(subscription.context, args);
                if (subscription.once) {
                    EventBus.stopListening(evt, subscription.callback);
                }
            });
        }

        static stopListening(evt, fn) {
            if (!events[evt]) {
                return false;
            }

            if (typeof fn === 'function') {
                const eventIndex = events[evt].findIndex(
                    subscription => fn === subscription.callback && subscription.once
                );

                events[evt].splice(eventIndex, 1);
            }

            if (events[evt].length === 0 || typeof fn !== 'function') {
                delete events[evt];
            }
        }

        static installTo(obj) {
            obj.listenTo = EventBus.listenTo;
            obj.listenToOnce = EventBus.listenToOnce;
            obj.broadcast = EventBus.broadcast;
            obj.stopListening = EventBus.stopListening;
        }

        static getEvents() {
            return events;
        }

    }
    
    return EventBus;
})();
