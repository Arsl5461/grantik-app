import image1 from '../../assets/images/image1.png'
import { getPhotos } from '../../features/misc/api/checkout';

const Features = () => {
  return (
    <div className="max-w-7xl mx-auto mt-28" id="aletrun">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-16">
        <div className='px-6 md:col-span-2 text-slate-700'>
          <div className="max-w-3xl mb-20 mx-auto">
            <h1 className='text-center text-6xl font-bold text-slate-800'>Lasermyndir og áletrun</h1>
          </div>
          <p className='text-xl'>Lasergrafering á legsteina er tækni til að flytja hvaða ljósmynd sem er yfir á granítyfirborðið með leysigeislum.<br/> Með þessari aðferð er hægt er að setja allar útfærslur af myndum á legstein, hvort sem það er andlitsmynd eða önnur mynd sem lýsir viðkomandi.<br/> Hægt er að hafa myndir bæði að framan og að aftan á legsteininn.<br />
            Laser tækni gerir þér kleift að fá hágæða mynd á legsteina, vasa og duftker.
          </p>
          <p className='text-xl hidden' onClick={() => getPhotos()}>lasergrafering</p>
          <p className='text-xl mt-3 mb-3 font-semibold'>Myndvinnsluferli og lasergrafering er hönnuð af Granít Verk á Íslandi.</p>
          <p className='text-xl'>
            Ef spurningar vakna er velkomið að hafa samband, hvort sem þig vantar ráðgjöf eða hugmynd sem þú finnur ekki á vefnum.<br /> Hafðu samband á granitverk@granitverk.is og við skoðum málið saman.
          </p>
          <p className='text-xl mt-3 mb-3 font-semibold'>Innifalið í verði legsteins er allt letur.</p>
          <p className='text-xl'>Lasermyndir- Verðlisti</p>
          <p className='text-xl'>Stærð (cm)</p>
          <p className='text-xl'>9 x 13 cm – 29.900 kr.</p>
          <p className='text-xl'>13 x 18 cm – 39.900 kr.</p>
          <p className='text-xl'>20 x 30 cm – 49.900 kr.</p>
          <p className='text-xl'>30 x 40 cm  - 59.900 kr.</p>
          <p className='text-xl'>50 x 60 cm – 69.900 kr</p>
          <p className='text-xl'>40/50 x 80 cm – 79.900 kr.</p>
        </div>
        <div className='mx-auto flex items-center'>
          <img src={image1} alt="image1" className='rounded-2xl max-w-sm' />
        </div>
      </div>
    </div>
  )
}

export default Features;
