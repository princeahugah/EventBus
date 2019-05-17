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
            EventBus.listenTo(evt, fn, context);

            events[evt].forEach((subscription) => {
                if (fn === subscription.callback) {
                    subscription.once = true;
                }
            });
        }

        static broadcast(evt, ...args) {
            if (!events[evt]) {
                return false;
            }
            
            events[evt].forEach((subscription) => {
                subscription.callback.apply(null, args);
                if (subscription.once) {
                    EventBus.stopListening(evt, subscription.callback);
                }
            });
        }

        static stopListening(evt, fn) {
            if (!events[evt]) {
                return false;
            }

            const eventIndex = events[evt].findIndex(
                subscription => fn === subscription.callback && subscription.once
            );

            events[evt].splice(eventIndex, 1);
            delete events[evt];
        }

        static installTo(obj) {
            obj.listenTo = EventBus.listenTo;
            obj.broadcast = EventBus.broadcast;
        }

        static getEvents() {
            return events;
        }

    }
    
    return EventBus;
}());