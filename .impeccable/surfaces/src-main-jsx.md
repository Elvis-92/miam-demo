# Miam multi-role order flow

## Job and audience

Three users share one meal order record: a customer ordering from a vendor, the Miam operator coordinating payment/preparation/dispatch, and a courier completing the delivery. The surface is an Operate-mode, mobile-first web prototype.

## Outcome and proof

Show the complete order lifecycle with clickable simulated data: browse a vendor menu, choose Petit/Moyen/Grand, compose a plate from priced portions and extras, set a delivery destination, review meal and packaging total, choose whether delivery is prepaid or collected at delivery, report MoMo payment, let the team manually verify it, mark the vendor as paid, dispatch to a courier, collect delivery charges when due, and record delivery. The same order reference and status must remain legible across all three roles.

## Selected direction

Use the printed food-order docket as the organizing system. Order details are line items and handoff information, not generic dashboard cards. The client receives the order summary; the team works the docket; the courier receives a delivery copy. The role selector moves between those views while keeping shared prototype state.

## Scope and boundaries

Deliver a responsive, clickable React + Vite prototype with fictitious, editable-in-code data. No real payment, messaging, vendor settlement, map, or delivery integrations. Avoid treating example prices, inclusion rules, capacities, or delivery time estimates as validated claims.

## States and ranges

Cover empty cart, order built, waiting for customer payment report, payment awaiting manual verification, verified/accepted, vendor preparation, vendor payment recorded, courier assigned, picked up, delivered, delivery fee due at delivery, delivery fee collected, and a failed-delivery reason. Demonstrate a few orders and menu items, including low-cost portions and higher-cost protein choices.

## Interaction and layout

Role switcher for Client / Équipe Miam / Livreur. The client path is a compact step flow with a persistent total and portion controls. The team workspace combines an order queue with a focused docket and explicit payment/dispatch actions. The courier workspace prioritizes the next stop, destination, collection due, and large status actions. Desktop can show queue beside the active docket; mobile stacks and keeps the current task primary.

## Constraints and open decisions

Small, medium, and large offer contents and exact prices, included portions, vendor purchase rates, packaging cost allocation, service charges, delivery fees/zones, order cutoff, refund and substitution policy, and true daily capacity remain unvalidated. Treat displayed amounts as test examples. Keep statuses understandable without color alone and make controls keyboard accessible.
