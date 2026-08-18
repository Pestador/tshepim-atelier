import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { money, products } from './data';
import './styles.css';

const asset = filename => `${import.meta.env.BASE_URL}images/${filename}`;

const Icon = ({ name, size = 22 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4.8 21a7.2 7.2 0 0 1 14.4 0"/></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m5 5 14 14M19 5 5 19"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    minus: <path d="M5 12h14"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    chevron: <path d="m8 10 4 4 4-4"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const Logo = ({ compact = false }) => <button className="logo" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="TshepiM Atelier home"><span className="monogram">TM</span>{!compact && <span className="wordmark">TshepiM Atelier</span>}</button>;

function Header({ cartCount, onBag, onSearch }) {
  const [menu, setMenu] = useState(false);
  return <>
    <a className="announcement" href="https://pestador.github.io/tshepim-atelier-fundraiser/">You’re viewing the concept store — support the real launch <Icon name="arrow" size={15}/></a>
    <header className="header">
      <Logo />
      <nav className={menu ? 'nav open' : 'nav'} aria-label="Main navigation">
        {['New in', 'Shop', 'The edit', 'About'].map((item, i) => <a key={item} href={['#new', '#shop', '#edit', '#about'][i]} onClick={() => setMenu(false)}>{item}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-btn search-btn" onClick={onSearch} aria-label="Search"><Icon name="search" /></button>
        <button className="icon-btn account-btn" onClick={() => alert('Account area is part of this fictional demo.')} aria-label="Account"><Icon name="user" /></button>
        <button className="bag-button" onClick={onBag} aria-label={`Shopping bag with ${cartCount} items`}><Icon name="bag"/><span>Bag ({cartCount})</span></button>
        <button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu"><Icon name={menu ? 'close' : 'menu'} /></button>
      </div>
    </header>
  </>;
}

function SearchOverlay({ open, onClose, onProduct }) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (!open) setQuery(''); }, [open]);
  if (!open) return null;
  const hits = products.filter(p => `${p.name} ${p.category} ${p.colour}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="overlay search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
    <div className="search-panel">
      <button className="icon-btn search-close" onClick={onClose} aria-label="Close search"><Icon name="close"/></button>
      <label htmlFor="search">Search the atelier</label>
      <div className="search-input-wrap"><Icon name="search"/><input id="search" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Try “dress” or “espresso”" /></div>
      {query && <div className="search-results">{hits.length ? hits.map(p => <button key={p.id} onClick={() => { onProduct(p); onClose(); }}><img src={p.image}/><span><strong>{p.name}</strong><small>{p.category} · {money(p.price)}</small></span><Icon name="arrow"/></button>) : <p>No pieces found. Try another search.</p>}</div>}
    </div>
  </div>;
}

function ProductCard({ product, onOpen, onQuickAdd }) {
  return <article className="product-card reveal">
    <button className="product-image" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name}/><span>View piece <Icon name="arrow" size={18}/></span></button>
    <div className="product-meta"><div><h3>{product.name}</h3><p>{product.colour}</p></div><strong>{money(product.price)}</strong></div>
    <button className="quick-add" onClick={() => onQuickAdd(product)}>Quick add — M</button>
  </article>;
}

function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);
  if (!product) return null;
  const add = () => { onAdd(product, size); setAdded(true); setTimeout(() => { setAdded(false); onClose(); }, 700); };
  return <div className="overlay" role="dialog" aria-modal="true" aria-label={product.name}>
    <div className="product-modal">
      <button className="icon-btn modal-close" onClick={onClose} aria-label="Close product"><Icon name="close"/></button>
      <div className="modal-media"><img src={product.image} alt={product.name}/></div>
      <div className="modal-info">
        <p className="category">{product.category}</p><h2>{product.name}</h2><p className="modal-price">{money(product.price)}</p>
        <p className="description">{product.description}</p>
        <div className="choice-head"><span>Colour</span><strong>{product.colour}</strong></div><span className="swatch" style={{background: product.colour === 'Ivory' ? '#e7dfd0' : product.colour === 'Cacao' ? '#4c3028' : '#34221c'}}/>
        <div className="choice-head"><span>Size</span><button onClick={() => alert('Size guide: XS 30–32, S 32–34, M 34–36, L 36–38, XL 38–40.')}>Size guide</button></div>
        <div className="sizes">{['XS','S','M','L','XL'].map(s => <button className={size === s ? 'selected' : ''} onClick={() => setSize(s)} key={s}>{s}</button>)}</div>
        <button className={`primary full ${added ? 'success' : ''}`} onClick={add}>{added ? <><Icon name="check"/> Added to bag</> : 'Add to bag'}</button>
        <div className="micro-proof"><span>Complimentary delivery over R 2,500</span><span>14-day returns</span></div>
      </div>
    </div>
  </div>;
}

function CartDrawer({ open, cart, onClose, changeQty, remove, onCheckout }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return <><div className={`drawer-scrim ${open ? 'show' : ''}`} onClick={onClose}/><aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="Shopping bag">
    <div className="drawer-head"><div><p>Your bag</p><span>{cart.reduce((s,i)=>s+i.qty,0)} pieces</span></div><button className="icon-btn" onClick={onClose} aria-label="Close bag"><Icon name="close"/></button></div>
    <div className="cart-list">{cart.length ? cart.map(item => <div className="cart-item" key={`${item.id}-${item.size}`}>
      <img src={item.image} alt=""/><div><h3>{item.name}</h3><p>{item.colour} / {item.size}</p><strong>{money(item.price)}</strong><div className="qty"><button onClick={() => changeQty(item, -1)}><Icon name="minus" size={16}/></button><span>{item.qty}</span><button onClick={() => changeQty(item, 1)}><Icon name="plus" size={16}/></button></div><button className="remove" onClick={() => remove(item)}>Remove</button></div>
    </div>) : <div className="empty-bag"><Icon name="bag" size={38}/><h3>Your bag is empty</h3><p>Continue exploring the collection.</p><button className="text-link" onClick={onClose}>Shop new arrivals</button></div>}</div>
    {cart.length > 0 && <div className="drawer-total"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Delivery and taxes calculated at checkout.</p><button className="primary full" onClick={onCheckout}>Checkout</button><button className="secondary full" onClick={onClose}>Continue shopping</button></div>}
  </aside></>;
}

const Field = ({label, type='text', required=true, ...props}) => <label className="field"><span>{label}</span><input type={type} required={required} {...props}/></label>;

function Checkout({ cart, onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState('Card');
  const [processing, setProcessing] = useState(false);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = subtotal >= 2500 ? 0 : 120;
  const advance = e => { e.preventDefault(); setStep(Math.min(4, step + 1)); scrollTo({top:0, behavior:'smooth'}); };
  const place = () => { setProcessing(true); setTimeout(() => { setProcessing(false); onDone(); }, 1200); };
  return <main className="checkout-page">
    <div className="checkout-top"><Logo/><button className="text-link" onClick={onBack}>Return to shop</button></div>
    <div className="checkout-steps">{['Contact','Delivery','Payment','Review'].map((s,i)=><div className={step === i+1 ? 'active' : step > i+1 ? 'done' : ''} key={s}><span>{step > i+1 ? <Icon name="check" size={14}/> : i+1}</span><small>{s}</small></div>)}</div>
    <div className="checkout-layout"><section className="checkout-main">
      {step === 1 && <form onSubmit={advance}><p className="category">Step 1 of 4</p><h1>Contact</h1><p className="form-intro">Where should we send your order updates?</p><Field label="Email address" type="email" defaultValue="hello@tshepim.co.za"/><label className="checkbox"><input type="checkbox" defaultChecked/> Email me new edits and private events</label><button className="primary full">Continue to delivery</button></form>}
      {step === 2 && <form onSubmit={advance}><p className="category">Step 2 of 4</p><h1>Delivery</h1><p className="form-intro">Complimentary delivery is applied automatically.</p><div className="field-grid"><Field label="First name" defaultValue="Tshepi"/><Field label="Last name" defaultValue="Mokoena"/></div><Field label="Address" defaultValue="12 Oxford Road"/><Field label="Apartment (optional)" required={false}/><div className="field-grid"><Field label="City" defaultValue="Cape Town"/><Field label="Postal code" defaultValue="8001"/></div><Field label="Phone" type="tel" defaultValue="+27 82 123 4567"/><button className="primary full">Continue to payment</button></form>}
      {step === 3 && <form onSubmit={advance}><p className="category">Step 3 of 4</p><h1>Payment</h1><div className="demo-notice"><span>Demo checkout</span>No payment will be processed and no card data is stored.</div><div className="pay-tabs">{['Card','PayPal','Apple Pay'].map(p=><button type="button" className={payment===p?'active':''} onClick={()=>setPayment(p)} key={p}>{p}</button>)}</div>{payment === 'Card' ? <><Field label="Card number" inputMode="numeric" defaultValue="4242 4242 4242 4242"/><Field label="Name on card" defaultValue="Tshepi Mokoena"/><div className="field-grid"><Field label="Expiry" defaultValue="12 / 28"/><Field label="CVC" defaultValue="123"/></div></> : <div className="express-pay"><strong>{payment}</strong><p>This button simulates redirecting to {payment}. No account is contacted.</p></div>}<button className="primary full">Continue to review</button></form>}
      {step === 4 && <div><p className="category">Step 4 of 4</p><h1>Review your order</h1><div className="review-block"><h3>Contact</h3><p>hello@tshepim.co.za</p><button onClick={()=>setStep(1)}>Edit</button></div><div className="review-block"><h3>Delivery</h3><p>Tshepi Mokoena<br/>12 Oxford Road, Cape Town, 8001</p><button onClick={()=>setStep(2)}>Edit</button></div><div className="review-block"><h3>Payment</h3><p>{payment === 'Card' ? 'Demo card ending in 4242' : `Demo ${payment}`}</p><button onClick={()=>setStep(3)}>Edit</button></div><div className="demo-notice"><span>Demo checkout</span>Placing this order creates a local confirmation only.</div><button className="primary full" onClick={place} disabled={processing}>{processing ? 'Creating demo order…' : 'Place demo order'}</button></div>}
    </section><OrderSummary cart={cart} subtotal={subtotal} shipping={shipping}/></div>
  </main>;
}

function OrderSummary({cart, subtotal, shipping}) { return <aside className="order-summary"><h2>Order summary</h2>{cart.map(i=><div className="summary-item" key={`${i.id}-${i.size}`}><div><img src={i.image}/><span>{i.qty}</span></div><p><strong>{i.name}</strong><small>{i.colour} / {i.size}</small></p><b>{money(i.price*i.qty)}</b></div>)}<div className="summary-lines"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Delivery</span><strong>{shipping ? money(shipping) : 'Complimentary'}</strong></p><p className="total"><span>Total</span><strong>{money(subtotal+shipping)}</strong></p></div></aside> }

function Confirmation({ onHome }) { return <main className="confirmation"><Logo/><div className="confirmation-mark"><Icon name="check" size={36}/></div><p className="category">Demo order confirmed</p><h1>Thank you, Tshepi.</h1><p>Your fictional order <strong>#TM-0826</strong> has been created. No payment was processed.</p><div className="confirmation-card"><div><span>Delivery estimate</span><strong>2–4 business days</strong></div><div><span>Order total</span><strong>Demo only</strong></div></div><button className="primary" onClick={onHome}>Return to the atelier</button></main> }

function App() {
  const [cart, setCart] = useState([]), [bagOpen,setBagOpen]=useState(false), [selected,setSelected]=useState(null), [search,setSearch]=useState(false), [view,setView]=useState('shop'), [toast,setToast]=useState(''), [filter,setFilter]=useState('All');
  const filtered = useMemo(()=> filter==='All' ? products : products.filter(p=>p.category===filter),[filter]);
  useEffect(()=>{ const els=document.querySelectorAll('.reveal'); const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12}); els.forEach(el=>io.observe(el)); return()=>io.disconnect();},[filter,view]);
  const add = (product,size='M') => { setCart(c=>{ const found=c.find(i=>i.id===product.id&&i.size===size); return found ? c.map(i=>i===found?{...i,qty:i.qty+1}:i) : [...c,{...product,size,qty:1}];}); setToast(`${product.name} added to your bag.`); setTimeout(()=>setToast(''),2200); };
  const changeQty=(item,d)=>setCart(c=>c.map(i=>i.id===item.id&&i.size===item.size?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const remove=item=>setCart(c=>c.filter(i=>!(i.id===item.id&&i.size===item.size)));
  const count=cart.reduce((s,i)=>s+i.qty,0);
  if(view==='checkout') return <Checkout cart={cart} onBack={()=>setView('shop')} onDone={()=>{setView('confirmation');setCart([])}}/>;
  if(view==='confirmation') return <Confirmation onHome={()=>setView('shop')}/>;
  return <div>
    <Header cartCount={count} onBag={()=>setBagOpen(true)} onSearch={()=>setSearch(true)}/>
    <SearchOverlay open={search} onClose={()=>setSearch(false)} onProduct={setSelected}/>
    <section className="hero">
      <div className="hero-copy"><h1>Dressed for the life you’re becoming.</h1><p>Modern silhouettes. Considered details. Made to move with you.</p><div><a className="primary" href="#shop">Shop the collection</a><a className="text-link" href="#edit">Explore the edit</a></div></div>
      <div className="hero-image"><img src={asset('hero.png')} alt="TshepiM Atelier tailoring overlooking Cape Town"/><span>TshepiM / Edition 01</span></div>
      <div className="scroll-note">Scroll to discover <Icon name="chevron" size={18}/></div>
    </section>
    <section className="collection section" id="shop"><div className="section-head"><div><p className="category" id="new">Curated now</p><h2>New arrivals</h2></div><p>Designed to work hard in your wardrobe—and look entirely effortless doing it.</p></div>
      <div className="filters">{['All','Dresses','Tops','Tailoring','Accessories'].map(f=><button className={filter===f?'active':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div>
      <div className="product-grid">{filtered.map(p=><ProductCard product={p} onOpen={setSelected} onQuickAdd={add} key={p.id}/>)}</div>
    </section>
    <section className="edit-section reveal" id="edit"><div className="edit-copy"><p className="category">The edit</p><h2>The Soft<br/>Power Edit</h2><p>Ease, structure and a little drama—pieces that hold their own from first light to last reservation.</p><button className="text-link" onClick={()=>{setFilter('Tops');document.querySelector('#shop').scrollIntoView({behavior:'smooth'})}}>Shop the edit</button></div><img src={asset('editorial.png')} alt="The Soft Power Edit"/></section>
    <section className="becoming reveal" id="about"><div><p className="category">Our point of view</p><h2>Made for your becoming.</h2><p>TshepiM Atelier is a fictional South African fashion house for this interactive concept—built around confidence, considered form, and fewer, better pieces.</p><div className="proof"><span>Small-batch curation</span><span>South Africa delivery</span><span>14-day returns</span></div></div><img src={asset('oxblood-still.png')} alt="Oxblood sculptural bag still life"/></section>
    <section className="journal section reveal"><div><p className="category">Journal</p><h2>Notes from the atelier</h2><button className="text-link" onClick={()=>alert('The journal is a sample area in this fictional demo.')}>Read the journal</button></div>{[['08 Aug','On quiet confidence and everyday luxury'],['24 Jul','The power of proportion'],['10 Jul','In the studio: a study in form']].map(([date,title])=><article key={title}><small>{date}</small><h3>{title}</h3><button className="text-link" onClick={()=>alert('Sample journal story.')}>Read more</button></article>)}</section>
    <footer><Logo/><p>Fictional boutique demo, thoughtfully made for TshepiM.</p><div><a href="#shop">Shop</a><a href="#about">About</a><a href="https://pestador.github.io/tshepim-atelier-fundraiser/">Support the Real Launch</a><button onClick={()=>alert('hello@tshepim-demo.co.za (fictional)')}>Contact</button></div><small>© 2026 TshepiM Atelier. Demo experience — no real purchases.</small></footer>
    <ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={add}/><CartDrawer open={bagOpen} cart={cart} onClose={()=>setBagOpen(false)} changeQty={changeQty} remove={remove} onCheckout={()=>{setBagOpen(false);setView('checkout');scrollTo(0,0)}}/>
    {toast && <div className="toast"><Icon name="check"/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
