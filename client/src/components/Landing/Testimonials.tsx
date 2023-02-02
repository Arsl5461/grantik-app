import image3 from '../../assets/images/image3.png'

function Testimonials() {
  return (
    <div className='bg-white py-16'>
      <div className='max-w-7xl mx-auto pt-30'>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-16">
          <div className='px-6 text-slate-700 flex items-center'>
            <p className='text-xl'>ppsetning í kirkjugörðum á höfuðborgarsvæðinu er innifalin í öllum okkar verðum á legsteinum.<br />
              Uppsetning í kirkjugörðum utan höfuðborgarsvæðisins er gegn akstursgjaldi (127 kr á km.)<br />

              Við uppsetningu legsteins, skiptum við um jarðveg undir steininum, setjum hellusand í staðinn fyrir moldina. Setjum upp legsteina allt árið kring.<br />
              Ef spurningar vakna er velkomið að hafa samband á granitverk@granitverk.is<br />
              Ef bíða þarf með uppsetningu þá geymir Granít Verk legsteina frítt.<br />
            </p>
          </div>
          <div className='mx-auto'>
            <img src={image3} alt="image3" className='rounded-2xl max-w-sm' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
