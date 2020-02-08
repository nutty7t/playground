# Actor Model

> Notes on video: Hewitt, Meijer and Szyperski: The Actor Model (everything you wanted to know...)
>
> https://www.youtube.com/watch?v=7erJ1DV_Tlo

An *actor* embodies three things:

- processing

- storage

- communication

"One ant is no ant."

Everything is an actor.

## Axioms

When an actor receives a message:

- it can create more actors

- it can send messages

- it can designate what it's going to do with the next message it receives

Conceptually, actors can only process a single message at a time.

All actors are addressable. Many-to-many relationship amongst actors and addresses.

An address can belong to many actors.

An actor may have multiple addresses.

Address != Identity.

## What is a *future*?

- a special kind of actor

- helps prevent deadlocking (messages sent from an actor to itself; cycles in the actor graph)

## Things I Don't Understand

- Capabilities

- Nondeterminism vs Indeterminism

- Communicating Sequential Processes

- Petri-nets

	- Law of the Excluded Miracle

	- Arbiter
