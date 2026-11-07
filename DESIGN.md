# Miam visual direction

Recorded from the clickable prototype; revise when the brand and operating rules are validated.

## World

The interface is an order docket with a detachable handoff copy. It uses the visual grammar of a carefully printed food order slip: a clear order number, ruled item rows, a visible total, sequential status marks, and distinct copies for the customer, Miam operations, and the courier. The docket is a working record, not a paper texture applied as decoration.

## First surface

A role switcher opens the customer, Miam team, and courier workspaces. The customer starts with the available meals and builds a plate from priced portions. The team verifies the reported MoMo payment and advances preparation and dispatch. The courier sees assigned stops and updates pickup and delivery. Each role reads the same order reference and the state it is responsible for.

## Visual rules

- Use the docket's information order: order reference, person and destination, line items, amount, then next action.
- Use a warm paper canvas (`#f6f3eb`, `#fffdf7`), dark ink (`#282c27`), clear ruled separators, and evergreen actions (`#315e4c`). Use restrained oxide orange (`#b95638`) for payment attention and order references.
- Use Newsreader for editorial page headings and DM Sans for controls, body copy, and operations. Align amounts with tabular numerals.
- Make statuses readable by label and shape as well as color. Keep prices and order references stable when role views change.
- On narrow screens, present one role and one active task at a time; keep the primary action reachable and preserve the total on ordering screens.

## Components and states

- A persistent role switcher leads to customer, team, and courier views.
- Menu offers and portions use ruled rows and quantity controls. The mobile order total stays reachable while the customer browses.
- Order slips repeat the same reference, customer, portions, destination, payment state, and delivery charge across handoffs.
- The team queue sits beside a focused order slip on wide screens and stacks above it on phones. Courier work centers on the selected stop and its next status action.
- Status is carried by a text label and a small marker; live, waiting, and completed states remain understandable without color.

## Honest limits

Menu prices, offer contents, portion sizes, fees, timings, vendors, customers, and delivery zones in the prototype are illustrative. The interface is not connected to MoMo Pay or a live dispatch service.
