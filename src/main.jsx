import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/600.css';
import './styles.css';

const menu = [
  { id: 'riz', name: 'Riz parfumé', group: 'Base', price: 200, tag: 'Le classique' },
  { id: 'macaroni', name: 'Macaroni', group: 'Base', price: 250, tag: 'Sauce tomate' },
  { id: 'haricots', name: 'Haricots', group: 'Base', price: 250, tag: 'Bien mijotés' },
  { id: 'aloco', name: 'Aloco', group: 'Accompagnement', price: 100, tag: 'Doré minute' },
  { id: 'frites', name: 'Frites de pomme', group: 'Accompagnement', price: 150, tag: 'Croustillantes' },
  { id: 'poisson', name: 'Poisson braisé', group: 'Protéine', price: 200, tag: 'Selon arrivage' },
  { id: 'viande', name: 'Viande en sauce', group: 'Protéine', price: 250, tag: 'Tendre et relevée' },
];

const offers = [
  { id: 'small', name: 'Petit', price: 500, included: 2, note: '2 portions au choix' },
  { id: 'medium', name: 'Moyen', price: 800, included: 3, note: '3 portions au choix' },
  { id: 'large', name: 'Grand', price: 1100, included: 4, note: '4 portions au choix' },
];

const initialOrders = [
  {
    id: 'M-2408', customer: 'Aïcha K.', phone: '97 00 24 18', destination: 'Ganhi · Immeuble Les Palmiers',
    zone: 'Ganhi', offer: 'Moyen', lines: [{ id: 'riz', qty: 1 }, { id: 'aloco', qty: 1 }, { id: 'poisson', qty: 1 }],
    mealTotal: 800, extraTotal: 0, deliveryFee: 500, deliveryPayment: 'À la commande', deliveryCollected: false, state: 'En attente de paiement',
    paymentStatus: 'À vérifier', vendorStatus: 'À préparer', vendorPaid: false, courier: null, time: '11:18',
  },
  {
    id: 'M-2407', customer: 'Idriss T.', phone: '96 11 38 52', destination: 'Haie Vive · Cabinet Afi',
    zone: 'Haie Vive', offer: 'Grand', lines: [{ id: 'macaroni', qty: 1 }, { id: 'haricots', qty: 1 }, { id: 'viande', qty: 3, includedQty: 2, extraQty: 1, extraPrice: 250 }],
    mealTotal: 1350, extraTotal: 250, deliveryFee: 700, deliveryPayment: 'À la livraison', deliveryCollected: false, state: 'À récupérer',
    paymentStatus: 'Vérifié', vendorStatus: 'Prêt', vendorPaid: true, courier: 'Kossi', time: '11:05',
  },
  {
    id: 'M-2406', customer: 'Mariam S.', phone: '94 20 15 30', destination: 'Marina · Bâtiment Horizon',
    zone: 'Marina', offer: 'Petit', lines: [{ id: 'riz', qty: 1 }, { id: 'aloco', qty: 1 }],
    mealTotal: 500, extraTotal: 0, deliveryFee: 500, deliveryPayment: 'À la commande', deliveryCollected: true, state: 'En livraison',
    paymentStatus: 'Vérifié', vendorStatus: 'Prêt', vendorPaid: true, courier: 'Félix', time: '10:52',
  },
];

const format = (amount) => `${amount.toLocaleString('fr-FR')} F`;
const getMenuItem = (id) => menu.find((item) => item.id === id);
const orderTotal = (order) => order.mealTotal + (order.deliveryPayment === 'À la commande' ? order.deliveryFee : 0);
const paymentDueNow = (order) => order.mealTotal + (order.deliveryPayment === 'À la commande' ? order.deliveryFee : 0);

function extraPortionTotal(quantities, included) {
  return portionBreakdown(quantities, included).reduce((sum, line) => sum + line.extraPrice, 0);
}

function portionBreakdown(quantities, included) {
  let covered = 0;
  return menu.flatMap((item) => {
    const qty = quantities[item.id] || 0;
    if (!qty) return [];
    const includedQty = Math.min(qty, Math.max(0, included - covered));
    const extraQty = qty - includedQty;
    covered += includedQty;
    return [{ item, qty, includedQty, extraQty, extraPrice: extraQty * item.price }];
  });
}

function Icon({ name, size = 18 }) {
  const paths = {
    plate: <><path d="M3 12h18"/><path d="M5 12a7 7 0 0 0 14 0"/><path d="M12 5v2M7 6l1 2M17 6l-1 2"/></>,
    receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h4"/></>,
    route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 4-4V10a4 4 0 0 1 4-4"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function RoleTabs({ role, setRole, count }) {
  const roles = [
    { id: 'client', label: 'Commander', icon: 'plate' },
    { id: 'team', label: 'Équipe Miam', icon: 'receipt', count },
    { id: 'courier', label: 'Livreur', icon: 'route' },
  ];
  return <nav className="role-tabs" aria-label="Choisir un espace">
    {roles.map((item) => <button key={item.id} className={`role-tab ${role === item.id ? 'is-active' : ''}`} onClick={() => setRole(item.id)} aria-pressed={role === item.id}>
      <Icon name={item.icon} size={17} /><span>{item.label}</span>{item.count > 0 && <b>{item.count}</b>}
    </button>)}
  </nav>;
}

function Status({ children, tone = 'neutral' }) { return <span className={`status status-${tone}`}><i />{children}</span>; }

function StepRail({ active, steps }) {
  return <div className="step-rail" aria-label="Étapes de la commande">{steps.map((step, index) => <div className={`step ${index < active ? 'is-done' : ''} ${index === active ? 'is-current' : ''}`} key={step}>
    <span className="step-mark">{index < active ? <Icon name="check" size={13} /> : String(index + 1).padStart(2, '0')}</span><span>{step}</span>
  </div>)}</div>;
}

function OrderSlip({ order, compact = false, footer }) {
  return <section className={`slip ${compact ? 'slip-compact' : ''}`} aria-label={`Commande ${order.id}`}>
    <div className="slip-head"><span className="slip-label">Bon de commande</span><span className="slip-id">{order.id}</span></div>
    <div className="slip-meta"><span><small>Client</small><b>{order.customer}</b></span><span><small>Reçue à</small><b>{order.time}</b></span></div>
    <div className="slip-rule" />
    <div className="slip-lines">{order.lines.map((line, index) => <div className="slip-line" key={`${line.id}-${index}`}><span>{line.qty} × {getMenuItem(line.id)?.name}</span><b>{line.extraQty ? `${line.includedQty || 0} incl. · ${line.extraQty} en plus` : `${line.qty} portion${line.qty > 1 ? 's' : ''}`}</b></div>)}</div>
    <div className="slip-rule dashed" />
    <div className="slip-meta"><span><small>Format</small><b>{order.offer}</b></span><span><small>Destination</small><b>{order.destination}</b></span></div>
    {!compact && <><div className="slip-total"><span>Repas · emballage inclus</span><b>{format(order.mealTotal)}</b></div><div className="slip-total slip-delivery"><span>Livraison · {order.deliveryPayment.toLowerCase()}</span><b>{order.deliveryPayment === 'À la commande' ? format(order.deliveryFee) : `${format(order.deliveryFee)} à percevoir`}</b></div><div className="slip-total slip-grand"><span>Total à la commande</span><b>{format(orderTotal(order))}</b></div></>}
    {footer && <div className="slip-footer">{footer}</div>}
  </section>;
}

function ClientView({ orders, setOrders }) {
  const [offerId, setOfferId] = useState('medium');
  const [quantities, setQuantities] = useState({ riz: 1, aloco: 1, poisson: 1 });
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('Ganhi · Immeuble Les Palmiers');
  const [deliveryPayment, setDeliveryPayment] = useState('now');
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [notice, setNotice] = useState('');
  const offer = offers.find((entry) => entry.id === offerId);
  const lineCount = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const includedCount = Math.min(lineCount, offer.included);
  const extraTotal = useMemo(() => extraPortionTotal(quantities, offer.included), [quantities, offer.included]);
  const deliveryFee = destination.includes('Haie Vive') ? 700 : 500;
  const mealTotal = offer.price + extraTotal;
  const checkoutTotal = mealTotal + (deliveryPayment === 'now' ? deliveryFee : 0);
  const activeOrder = orders.find((order) => order.id === activeOrderId);

  function changeQuantity(id, amount) {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + amount) }));
    setNotice('');
  }
  function submitOrder() {
    const newOrder = {
      id: `M-24${String(orders.length + 9).padStart(2, '0')}`, customer: 'Client démo', phone: '97 00 00 00', destination,
      zone: destination.split(' · ')[0], offer: offer.name,
      lines: portionBreakdown(quantities, offer.included).map(({ item, qty, includedQty, extraQty, extraPrice }) => ({ id: item.id, qty, includedQty, extraQty, extraPrice })),
      mealTotal, extraTotal, deliveryFee, deliveryPayment: deliveryPayment === 'now' ? 'À la commande' : 'À la livraison',
      deliveryCollected: false,
      state: 'Paiement annoncé', paymentStatus: 'À vérifier', vendorStatus: 'À préparer', vendorPaid: false, courier: null, time: '11:26',
    };
    setOrders((current) => [newOrder, ...current]);
    setActiveOrderId(newOrder.id);
    setStep(3);
  }

  if (activeOrder) return <div className="customer-layout confirmation-layout">
    <div className="customer-main">
      <StepRail active={3} steps={['Menu', 'Composer', 'Livraison', 'Confirmation']} />
      <div className="success-mark"><Icon name="check" size={24} /></div>
      <h1>Commande bien envoyée.</h1>
      <p className="lede">On vérifie ton paiement avant de lancer la préparation. Tu peux suivre la suite ici.</p>
      <div className="confirmation-slip"><OrderSlip order={activeOrder} footer={<Status tone="wait">Paiement à vérifier par Miam</Status>} /></div>
      <div className="confirmation-actions"><button className="button button-primary" onClick={() => { setActiveOrderId(null); setStep(0); }}>Passer une autre commande <Icon name="arrow" size={16} /></button><p>Référence à garder : <strong>{activeOrder.id}</strong></p></div>
    </div>
    <aside className="customer-aside"><h2>La suite du trajet</h2><div className="journey-list"><div className="journey-item is-done"><span>01</span><div><b>Commande reçue</b><small>Le bon est prêt</small></div></div><div className="journey-item is-current"><span>02</span><div><b>Vérification du paiement</b><small>Contrôle manuel par l’équipe Miam</small></div></div><div className="journey-item"><span>03</span><div><b>Préparation</b><small>Après confirmation</small></div></div><div className="journey-item"><span>04</span><div><b>Livraison</b><small>Tu recevras le statut ici</small></div></div></div><p className="demo-note">Scénario de démonstration : le paiement n’est pas réellement envoyé.</p></aside>
  </div>;

  return <div className="customer-layout">
    <main className="customer-main">
      <StepRail active={step} steps={['Menu', 'Composer', 'Livraison', 'Paiement']} />
      {step === 0 && <>
        <div className="section-heading"><div><span className="overline">Au menu aujourd’hui</span><h1>Le bon repas, sans bouger.</h1><p className="lede">Choisis ta restauratrice, puis compose ton assiette.</p></div><span className="open-badge"><i />Commande ouverte</span></div>
        <div className="vendor-banner"><div className="vendor-seal"><Icon name="plate" size={25} /></div><div><span className="vendor-label">Cantine du Port · sélection démo</span><h2>Chez Restauratrice A</h2><p>Plats du jour, portions au choix</p></div><span className="vendor-arrow"><Icon name="arrow" /></span></div>
        <section className="menu-section"><div className="section-row"><h2>Choisis ton format</h2><span className="sample-label">Prix de test</span></div><p className="helper-copy">L’emballage standard est inclus. Les détails des portions sont à confirmer avec les vendeuses.</p>
          <div className="offer-row">{offers.map((entry) => <button className={`offer-option ${offerId === entry.id ? 'selected' : ''}`} key={entry.id} onClick={() => setOfferId(entry.id)} aria-pressed={offerId === entry.id}>
            <span className="offer-name">{entry.name}</span><b className="offer-price">{format(entry.price)}</b><small>{entry.note}</small>{offerId === entry.id && <span className="offer-check"><Icon name="check" size={13} /></span>}
          </button>)}</div>
        </section>
        <section className="menu-section ingredients-section"><div className="section-row"><h2>Compose ton assiette</h2><span className="selection-count">{lineCount} portions choisies</span></div><p className="helper-copy">Choisis les éléments que tu veux. Les portions au-delà de {offer.included} s’ajoutent au prix.</p>
          <div className="ingredient-list">{menu.map((item) => <div className={`ingredient-row ${quantities[item.id] ? 'has-quantity' : ''}`} key={item.id}>
            <div className={`food-mark food-${item.group.toLowerCase().replace('é', 'e')}`}><span>{item.name.slice(0, 1)}</span></div><div className="ingredient-info"><b>{item.name}</b><small>{item.tag}</small></div><div className="ingredient-price"><b>{format(item.price)}</b><small>repère par portion</small></div><div className="quantity-control"><button aria-label={`Retirer ${item.name}`} disabled={!quantities[item.id]} onClick={() => changeQuantity(item.id, -1)}><Icon name="minus" size={15} /></button><span>{quantities[item.id] || 0}</span><button aria-label={`Ajouter ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><Icon name="plus" size={15} /></button></div>
          </div>)}</div>
          {notice && <p className="inline-error" role="alert">{notice}</p>}
        </section>
        <div className="mobile-total-bar"><span><small>{lineCount} portions · {includedCount} incluses</small><b>{format(mealTotal)} <em>+ livraison</em></b></span><button className="button button-primary" onClick={() => { if (!lineCount) { setNotice('Choisis au moins une portion pour continuer.'); return; } setStep(1); }}>Continuer <Icon name="arrow" size={16} /></button></div>
        <div className="desktop-continue"><span>{lineCount} portions · {includedCount} incluses · emballage compris</span><b>{format(mealTotal)}</b><button className="button button-primary" onClick={() => { if (!lineCount) { setNotice('Choisis au moins une portion pour continuer.'); return; } setStep(1); }}>Continuer <Icon name="arrow" size={16} /></button></div>
      </>}
      {step === 1 && <>
        <div className="section-heading"><div><span className="overline">Ton assiette</span><h1>Encore un petit choix.</h1><p className="lede">Vérifie le format et les portions avant la livraison.</p></div><span className="sample-label">Prix de test</span></div>
        <div className="composition-summary"><div className="composition-title"><div><small>FORMAT CHOISI</small><h2>{offer.name} <span>{format(offer.price)}</span></h2></div><button className="text-button" onClick={() => setStep(0)}>Modifier</button></div><div className="composition-lines">{portionBreakdown(quantities, offer.included).map((line) => <div className="composition-line" key={line.item.id}><span><b>{line.qty} ×</b> {line.item.name}</span><span>{line.extraQty ? `${line.includedQty} incl. · ${format(line.extraPrice)} en plus` : 'Inclus'}</span></div>)}</div><div className="composition-note"><Icon name="receipt" size={17} /><span>Ta formule inclut {offer.included} portions au choix. Les portions supplémentaires sont tarifées à la pièce.</span></div></div>
        <div className="checkout-total"><div><span>Repas</span><b>{format(mealTotal)}</b></div><div><span>Emballage standard</span><b>Inclus</b></div><div><span>Livraison estimée · {destination.split(' · ')[0]}</span><b>{format(deliveryFee)}</b></div><div className="grand-line"><span>Total si livraison payée maintenant</span><b>{format(mealTotal + deliveryFee)}</b></div></div>
        <div className="checkout-actions"><button className="button button-secondary" onClick={() => setStep(0)}>Retour au menu</button><button className="button button-primary" onClick={() => setStep(2)}>Choisir la livraison <Icon name="arrow" size={16} /></button></div>
      </>}
      {step === 2 && <>
        <div className="section-heading"><div><span className="overline">Livraison</span><h1>Où déposer le repas ?</h1><p className="lede">Choisis un point de livraison proposé dans cette maquette.</p></div></div>
        <div className="field-group"><label htmlFor="destination">Point de livraison</label><select id="destination" value={destination} onChange={(event) => setDestination(event.target.value)}><option>Ganhi · Immeuble Les Palmiers</option><option>Haie Vive · Cabinet Afi</option><option>Marina · Bâtiment Horizon</option></select><small>Zones et tarifs affichés à titre de démonstration.</small></div>
        <fieldset className="payment-choice"><legend>Quand régler la livraison ?</legend><label className={deliveryPayment === 'now' ? 'choice-selected' : ''}><input type="radio" name="deliveryPayment" value="now" checked={deliveryPayment === 'now'} onChange={() => setDeliveryPayment('now')} /><span><b>Avec la commande</b><small>Un paiement avant l’envoi du repas</small></span><b>{format(deliveryFee)}</b></label><label className={deliveryPayment === 'later' ? 'choice-selected' : ''}><input type="radio" name="deliveryPayment" value="later" checked={deliveryPayment === 'later'} onChange={() => setDeliveryPayment('later')} /><span><b>À la livraison</b><small>Le livreur percevra ces frais à l’arrivée</small></span><b>{format(deliveryFee)}</b></label></fieldset>
        <div className="checkout-total"><div><span>Repas · emballage inclus</span><b>{format(mealTotal)}</b></div><div><span>Livraison</span><b>{deliveryPayment === 'now' ? format(deliveryFee) : `${format(deliveryFee)} à l’arrivée`}</b></div><div className="grand-line"><span>À payer maintenant</span><b>{format(checkoutTotal)}</b></div></div>
        <div className="checkout-actions"><button className="button button-secondary" onClick={() => setStep(1)}>Retour</button><button className="button button-primary" onClick={() => setStep(3)}>Voir le paiement <Icon name="arrow" size={16} /></button></div>
      </>}
      {step === 3 && <>
        <div className="section-heading"><div><span className="overline">Dernière étape</span><h1>Règle par MoMo Pay.</h1><p className="lede">Le repas et l’emballage sont à régler maintenant. La livraison suit ton choix.</p></div><span className="demo-stamp">SIMULATION</span></div>
        <div className="momo-instructions"><div className="momo-top"><div className="momo-symbol">M</div><div><b>MoMo Pay</b><small>Numéro marchand de démonstration</small></div></div><div className="momo-number">97 00 00 00 <button className="text-button" onClick={() => setNotice('Numéro copié (simulation).')}>Copier</button></div><p>Montant à régler maintenant</p><strong>{format(checkoutTotal)}</strong><small className="demo-note">Aucun transfert réel ne sera effectué dans cette maquette.</small></div>
        <div className="payment-final-row"><div><Icon name="clock" /><span><b>Vérification manuelle</b><small>La préparation commence après validation par Miam.</small></span></div><Status tone="wait">À confirmer</Status></div>
        {notice && <p className="inline-success" role="status">{notice}</p>}
        <div className="checkout-actions"><button className="button button-secondary" onClick={() => setStep(2)}>Retour</button><button className="button button-primary" onClick={submitOrder}>J’ai payé <Icon name="arrow" size={16} /></button></div>
      </>}
    </main>
    <aside className="customer-aside order-aside"><div className="aside-heading"><h2>Ton bon</h2><span>MIAM · DÉMO</span></div><div className="mini-slip-head"><Icon name="receipt" size={18} /><span>Nouvelle commande</span><b>—</b></div><div className="mini-lines">{portionBreakdown(quantities, offer.included).length ? portionBreakdown(quantities, offer.included).map((line) => <div key={line.item.id}><span>{line.qty} × {line.item.name}</span><small>{line.extraQty ? `${format(line.extraPrice)} en plus` : 'Formule'}</small></div>) : <p>Ton assiette t’attend.</p>}</div><div className="aside-divider"/><div className="aside-math"><span>Format {offer.name.toLowerCase()} · prix fixe</span><b>{format(offer.price)}</b><span>Portions en plus</span><b>{format(extraTotal)}</b><span>Emballage</span><b>Inclus</b></div><div className="aside-grand"><span>Repas</span><b>{format(mealTotal)}</b></div><p className="aside-disclaimer">Données fictives de test. Prix réels à convenir avec les vendeuses.</p><div className="delivery-estimate"><Icon name="pin" size={17} /><span><b>Livraison à définir</b><small>Zone et tarif confirmés avant paiement</small></span></div></aside>
  </div>;
}

function TeamView({ orders, setOrders }) {
  const [selectedId, setSelectedId] = useState(orders[0]?.id);
  const [filter, setFilter] = useState('Toutes');
  const [toast, setToast] = useState('');
  const selected = orders.find((order) => order.id === selectedId) || orders[0];
  const filtered = orders.filter((order) => filter === 'Toutes' || (filter === 'À vérifier' ? order.paymentStatus === 'À vérifier' : order.state === filter));
  const pendingCount = orders.filter((order) => order.paymentStatus === 'À vérifier').length;

  function updateSelected(update) {
    if (!selected) return;
    setOrders((current) => current.map((order) => order.id === selected.id ? { ...order, ...update } : order));
    setToast('Bon mis à jour.');
    window.setTimeout(() => setToast(''), 2600);
  }

  if (!selected) return <div className="empty-state"><Icon name="receipt" size={32} /><h2>Aucun bon pour le moment</h2><p>Les commandes clients apparaîtront ici.</p></div>;

  return <div className="ops-layout">
    <aside className="ops-queue"><div className="ops-title"><div><span className="overline">Table de service</span><h1>Les bons du jour</h1></div><span className="queue-total">{orders.length} bons</span></div><div className="queue-filter"><label htmlFor="queue-filter">Afficher</label><select id="queue-filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Toutes</option><option>À vérifier</option><option>À préparer</option><option>À récupérer</option><option>En livraison</option><option>Livrée</option></select></div><div className="queue-list">{filtered.map((order) => <button key={order.id} className={`queue-item ${selected.id === order.id ? 'queue-selected' : ''}`} onClick={() => setSelectedId(order.id)}><span className="queue-item-top"><b>{order.id}</b><small>{order.time}</small></span><span className="queue-item-name">{order.customer}</span><span className="queue-item-bottom"><Status tone={order.paymentStatus === 'À vérifier' ? 'wait' : order.state === 'Livrée' ? 'done' : 'neutral'}>{order.paymentStatus === 'À vérifier' ? 'Paiement à vérifier' : order.state}</Status><b>{format(orderTotal(order))}</b></span></button>)}</div><div className="queue-foot"><span><i />{pendingCount} paiement{pendingCount > 1 ? 's' : ''} à vérifier</span><small>Actualisé à l’instant</small></div></aside>
    <main className="ops-workspace"><div className="workspace-head"><div><span className="overline">Suivi des opérations</span><h2>{selected.id} <span>· {selected.customer}</span></h2></div><Status tone={selected.state === 'Livrée' ? 'done' : selected.paymentStatus === 'À vérifier' ? 'wait' : 'active'}>{selected.state}</Status></div>
      <div className="ops-record-grid"><OrderSlip order={selected} /><div className="ops-actions-panel"><div className="panel-title"><h3>À faire</h3><span className="sample-label">Actions de démonstration</span></div>
        <section className="action-step"><div className={`action-number ${selected.paymentStatus === 'Vérifié' ? 'number-done' : ''}`}>{selected.paymentStatus === 'Vérifié' ? <Icon name="check" size={15} /> : '1'}</div><div className="action-copy"><b>Vérifier le paiement</b><small>Comparer le montant et la référence MoMo reçue.</small>{selected.paymentStatus === 'À vérifier' ? <button className="button button-compact" onClick={() => updateSelected({ paymentStatus: 'Vérifié', deliveryCollected: selected.deliveryPayment === 'À la commande', state: 'À préparer' })}>Confirmer reçu · {format(paymentDueNow(selected))}</button> : <Status tone="done">Paiement confirmé</Status>}</div></section>
        <section className="action-step"><div className={`action-number ${selected.vendorStatus === 'Prêt' ? 'number-done' : ''}`}>{selected.vendorStatus === 'Prêt' ? <Icon name="check" size={15} /> : '2'}</div><div className="action-copy"><b>Préparation vendeuse</b><small>Vérifier la disponibilité et le contenu du bon.</small>{selected.vendorStatus !== 'Prêt' ? <button className="text-button" disabled={selected.paymentStatus !== 'Vérifié'} onClick={() => updateSelected({ vendorStatus: 'Prêt', state: 'Prêt à partir' })}>Marquer le bon prêt <Icon name="arrow" size={14} /></button> : <Status tone="done">Prêt pour retrait</Status>}</div></section>
        <section className="action-step"><div className={`action-number ${selected.vendorPaid ? 'number-done' : ''}`}>{selected.vendorPaid ? <Icon name="check" size={15} /> : '3'}</div><div className="action-copy"><b>Régler la vendeuse</b><small>Après préparation, enregistrer le règlement convenu avec la restauratrice.</small>{selected.vendorPaid ? <Status tone="done">Règlement noté</Status> : <button className="button button-compact" disabled={selected.vendorStatus !== 'Prêt'} onClick={() => updateSelected({ vendorPaid: true })}>Marquer comme réglée</button>}</div></section>
        <section className="action-step"><div className={`action-number ${selected.courier ? 'number-done' : ''}`}>{selected.courier ? <Icon name="check" size={15} /> : '4'}</div><div className="action-copy"><b>Assigner un livreur</b><small>Proposition de tournée selon le secteur.</small>{selected.courier ? <div className="assigned-rider"><span className="avatar">{selected.courier.slice(0, 1)}</span><span><b>{selected.courier}</b><small>{selected.zone} · départ prévu 12:10</small></span><button className="text-button" onClick={() => updateSelected({ courier: null })}>Changer</button></div> : <div className="rider-choices"><button disabled={!selected.vendorPaid} onClick={() => updateSelected({ courier: 'Kossi', state: 'À récupérer' })}><span className="avatar">K</span><span>Kossi<small>Ganhi · 8 min</small></span><span className="assign-arrow">→</span></button><button disabled={!selected.vendorPaid} onClick={() => updateSelected({ courier: 'Félix', state: 'À récupérer' })}><span className="avatar avatar-alt">F</span><span>Félix<small>Marina · 11 min</small></span><span className="assign-arrow">→</span></button></div>}</div></section>
        {toast && <div className="toast" role="status">{toast}</div>}
        <div className="ops-note"><b>Règle de pilote</b><p>Ne confirmer le paiement qu’après rapprochement manuel dans MoMo Pay. Le règlement vendeuse est seulement noté ici : aucun transfert réel n’est connecté.</p></div>
      </div></div>
    </main>
  </div>;
}

function CourierView({ orders, setOrders }) {
  const [selectedId, setSelectedId] = useState(orders.find((order) => order.courier)?.id || orders[0]?.id);
  const [notice, setNotice] = useState('');
  const assigned = orders.filter((order) => order.courier);
  const selected = orders.find((order) => order.id === selectedId) || assigned[0] || orders[0];
  if (!selected) return <div className="empty-state"><Icon name="route" size={32} /><h2>Aucune course assignée</h2><p>Une commande apparaîtra ici dès que l’équipe Miam t’en confiera une.</p></div>;
  const statusIndex = ['À récupérer', 'Récupéré', 'En livraison', 'Livrée'].indexOf(selected.state);
  const dueAtDoor = selected.deliveryPayment === 'À la livraison' && !selected.deliveryCollected;
  const next = statusIndex < 1 ? { label: 'Confirmer le retrait', state: 'Récupéré' } : statusIndex < 2 ? { label: 'Démarrer la livraison', state: 'En livraison' } : statusIndex < 3 ? { label: dueAtDoor ? `Encaisser ${format(selected.deliveryFee)} et confirmer la remise` : 'Confirmer la remise', state: 'Livrée' } : null;
  function advance() {
    if (!next) return;
    setOrders((current) => current.map((order) => order.id === selected.id ? { ...order, state: next.state, ...(next.state === 'Livrée' && dueAtDoor ? { deliveryCollected: true } : {}) } : order));
    setNotice(next.state === 'Livrée' ? (dueAtDoor ? `Frais de ${format(selected.deliveryFee)} notés comme reçus. Livraison terminée.` : 'Livraison terminée. Merci !') : `Statut mis à jour : ${next.state.toLowerCase()}.`);
  }

  return <div className="courier-layout"><aside className="route-panel"><div className="route-heading"><div><span className="overline">Ta tournée</span><h1>Les prochaines courses.</h1></div><span className="route-count">{assigned.length} arrêt{assigned.length > 1 ? 's' : ''}</span></div><div className="route-date">Aujourd’hui <span>· tournée démo</span></div><div className="route-stops">{(assigned.length ? assigned : orders).map((order, index) => <button key={order.id} className={`route-stop ${selected.id === order.id ? 'stop-selected' : ''}`} onClick={() => setSelectedId(order.id)}><span className="stop-track"><i>{String(index + 1).padStart(2, '0')}</i></span><span className="stop-content"><b>{order.destination.split(' · ')[0]}</b><small>{order.customer} · {order.time}</small><Status tone={order.state === 'Livrée' ? 'done' : order.state === 'En livraison' ? 'active' : 'neutral'}>{order.state}</Status></span><span className="stop-total">{order.deliveryPayment === 'À la livraison' && !order.deliveryCollected ? <><b>{format(order.deliveryFee)}</b><small>à percevoir</small></> : order.deliveryPayment === 'À la livraison' ? <><b>Perçus</b><small>à la livraison</small></> : <><b>Réglé</b><small>en ligne</small></>}</span></button>)}</div><div className="route-foot"><Icon name="pin" size={18} /><span><b>Adresses fournies par Miam</b><small>Vérifie le point exact avec le client avant de partir.</small></span></div></aside>
    <main className="courier-workspace"><div className="courier-card-head"><div><span className="overline">Bon de livraison</span><h2>{selected.id} <span>· {selected.customer}</span></h2></div><Status tone={selected.state === 'Livrée' ? 'done' : 'active'}>{selected.state}</Status></div><div className="delivery-docket"><div className="delivery-recipient"><div className="recipient-mark">{selected.customer.slice(0, 1)}</div><div><small>À REMETTRE À</small><h3>{selected.customer}</h3><p>{selected.phone}</p></div><button className="button button-secondary" onClick={() => setNotice('Appel de démonstration · aucun appel réel.')}>Appeler</button></div><div className="destination-block"><Icon name="pin" size={20} /><div><small>POINT DE LIVRAISON</small><b>{selected.destination}</b><p>Demander le point exact à l’arrivée.</p></div><button className="text-button" onClick={() => setNotice('Itinéraire de démonstration · adresse à confirmer.')}>Itinéraire <Icon name="arrow" size={14} /></button></div><div className="courier-order-lines"><span className="mini-label">À transporter · {selected.offer}</span>{selected.lines.map((line, index) => <div key={`${line.id}-${index}`}><span>{line.qty} × {getMenuItem(line.id)?.name}</span><b>{line.qty} portion{line.qty > 1 ? 's' : ''}</b></div>)}</div><div className={`collection-slip ${selected.deliveryPayment === 'À la livraison' && !selected.deliveryCollected ? 'collection-due' : ''}`}><span><small>Frais de livraison</small><b>{selected.deliveryPayment === 'À la livraison' ? (selected.deliveryCollected ? 'Reçus à la livraison' : 'À percevoir du client') : 'Déjà réglés'}</b></span><strong>{format(selected.deliveryFee)}</strong></div><div className="delivery-timeline"><div className={statusIndex >= 0 ? 'timeline-done' : ''}><i />Bon reçu</div><div className={statusIndex >= 1 ? 'timeline-done' : ''}><i />Repas récupéré</div><div className={statusIndex >= 2 ? 'timeline-done' : ''}><i />En route</div><div className={statusIndex >= 3 ? 'timeline-done' : ''}><i />Remis au client</div></div>{notice && <p className="inline-success" role="status">{notice}</p>}{next ? <button className="button button-primary courier-action" onClick={advance}>{next.label} <Icon name="arrow" size={16} /></button> : <div className="delivered-banner"><Icon name="check" size={17} />Course clôturée</div>}</div><p className="demo-note courier-demo-note">Prototype : téléphone et itinéraire ne déclenchent pas d’appel ou de navigation réels.</p></main>
  </div>;
}

function App() {
  const [role, setRole] = useState('client');
  const [orders, setOrders] = useState(initialOrders);
  const reviewCount = orders.filter((order) => order.paymentStatus === 'À vérifier').length;
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="Miam, accueil"><span className="brand-mark"><Icon name="plate" size={19} /></span><span>miam<span className="brand-dot">.</span></span></a><RoleTabs role={role} setRole={setRole} count={reviewCount} /><div className="top-meta"><span className="live-dot" />MODE DÉMO<span className="top-divider" /><button className="profile-button" aria-label="Profil de démonstration">E</button></div></header>
    <div className="prototype-banner"><span><b>Maquette de test</b> · prix, portions, vendeurs et zones sont des exemples à valider.</span><button onClick={() => setRole('team')}>Ouvrir l’espace équipe <Icon name="arrow" size={14} /></button></div>
    <div className="workspace" id="top">{role === 'client' ? <ClientView orders={orders} setOrders={setOrders} /> : role === 'team' ? <TeamView orders={orders} setOrders={setOrders} /> : <CourierView orders={orders} setOrders={setOrders} />}</div>
    <footer className="app-footer"><span>MIAM · BON À MANGER, LIVRÉ AU BUREAU.</span><span>Prototype interactif · Ne réalise aucun paiement.</span></footer>
    <nav className="mobile-nav" aria-label="Changer d’espace">{[['client', 'plate', 'Commander'], ['team', 'receipt', 'Équipe'], ['courier', 'route', 'Livreur']].map(([id, icon, label]) => <button key={id} className={role === id ? 'mobile-nav-active' : ''} onClick={() => setRole(id)}><Icon name={icon} size={18} /><span>{label}</span></button>)}</nav>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
