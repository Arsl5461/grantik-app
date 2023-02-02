import image2 from '../../assets/images/image2.png'
import image3 from '../../assets/images/image3.png'

function FeaturesBlocks() {
  return (
    <div className='bg-gray-100 py-16 mt-20' id="afhending">
      <div className='max-w-7xl mx-auto pt-30'>
        <div className="max-w-3xl mb-20 mx-auto">
          <h1 className='text-center text-6xl font-bold text-slate-800'>Uppsetning og afhending</h1>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-16">
          <div className='mx-auto'>
            <img src={image2} alt="image1" className='rounded-2xl max-w-sm' />
          </div>
          <div className='px-6 flex items-center text-slate-700'>
            <p className='text-xl'>Uppsetning í kirkjugörðum á höfuðborgarsvæðinu er innifalin í öllum okkar verðum á legsteinum.<br />
              Uppsetning í kirkjugörðum utan höfuðborgarsvæðisins er gegn akstursgjaldi (170 kr. á km.)<br />

              Við uppsetningu legsteins, skiptum við um jarðveg undir steininum, setjum hellusand í staðinn fyrir moldina. Setjum upp legsteina allt árið kring.<br />
              Ef spurningar vakna er velkomið að hafa samband á granitverk@granitverk.is<br />
              Ef bíða þarf með uppsetningu þá geymir Granít Verk legsteina frítt.
            </p>
          </div>

        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-16">
          <div className='px-6 text-slate-700 flex items-center'>
            <p className='text-xl'>Afhending fer fram eftir samkomulagi, staðsetningu og hve langur tími liðinn frá því að gröf er tekin þar til setja má niður legstein.<br/>
              Ef varan er til á lager þá er hún afhent eftir samkomulagi.<br/>
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

export default FeaturesBlocks;
