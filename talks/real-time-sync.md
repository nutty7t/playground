Tuomas Artman: Real-time sync for web apps
https://youtu.be/WxK11RsLqp4?t=2171

- Every single piece of data in Linear is real-time synced
- No engineering needed when Sync Engine is in place; everything just updates automatically
- If you create a view that uses data; when that data updates, the view gets re-rendered
- No REST calls; No GraphQL calls

View
React components

Object graph
MobX observables
- Objects can appear in the object graph multiple times
- Solution: Make these objects references to a single object

Object pool
Proxy objects
- Normalizes data structures into a single pool
- Used to construct the object graph
- Uses TS decorators to describe models and the object graph construction behavior
- Must listen to changes for all properties

Transaction queue
- Changes to the object pool dispatches transactions
- Sent to the backend (websockets, GraphQL, REST, doesn't matter)
- Linear uses GraphQL
- If transaction is accepted, transaction is popped off the queue
- If transaction is rejected, transaction queue must rollback change
	- To rollback, must have snapshot before the transaction
	- If this happens, user will see a flicker because the change was optimistically applied
	- Toast message is displayed
	- There are some nuances; sometimes rebasing needs to be done

Backend
- Validates transactions
- Can `Accept` or `Reject` changes
- Broadcasts delta-packets to clients (sync resolver)

Sync Resolver
- Backend has queue of all updates that happened to the database
- WebSocket connection
- Resolve objects in question; modifies the object pool

Optimizing the hell out of it
- Object store caches object pool in IndexedDB
- Transaction queue is cached to object pool in IndexedDB
- Supports offline mode
- Hydrates object pool at bootstrap time (or when client goes online)
- Drains transaction queue at bootstrap time (or when client goes online)

How are transactions resolved offline?
- Optimistic application
- Last-Write-Wins
