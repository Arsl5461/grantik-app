import image4 from '../../assets/images/image4.png'

function Delivery() {
  return (
    <div className='py-16' id="fegrun">
      <div className='max-w-7xl mx-auto pt-30'>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-16">
          <div className='mx-auto flex items-center'>
            <img src={image4} alt="image4" className='rounded-2xl max-w-sm' />
          </div>
          <div className='px-6 text-slate-700'>
            <div className="max-w-3xl mb-20 mx-auto">
              <h1 className='text-center text-6xl font-bold text-slate-800'>Viðhald og fegrun legsteina/leiða.</h1>
            </div>
            <p className='text-xl'>Granít Verk tekur að sér viðhald og viðgerðir á eldri legsteinum.<br/>
              Sjáum um að rétta við legsteina sem eru farnir að halla eða falla á hliðina.<br/>
              Við bjóðum upp á að hreinsa upp eldri legsteina og endurmála þegar farið er að sjá á letri/málningu.<br/>
              Sendu okkur beiðni á netfangið okkar granitverk@granitverk.is með upplýsingum um hvað þú vilt gera og við gefum þér tilboð í verkið.<br/>
              Hafðu samband við okkur og láttu okkur sjá um viðhald og viðgerðir fyrir þig.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
