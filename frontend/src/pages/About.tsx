import { FaSearch, FaStar, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
    <section className="bg-linear-to-br from-purple-500 to-indigo-600 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
      Natuke ÕpetajateRate'ist
    </h1>
    <p className="text-base sm:text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
      ÕpetajateRate on platvorm, mis aitab õpilastel hinnata ja arvustada oma õpetajaid. 
      Loome läbipaistva kogukonna, kus õpilased saavad jagada kogemusi ja näha, mida teised arvavad.
      <br />
      ÕpetajateRate on loodud kooliprojekti raames, et edendada ausat tagasisidet hariduses. Meie eesmärk on parandada õpetamise kvaliteeti ja aidata õpilastel vabas vormis väljendada oma arvamust.
      <br />
      Loojad PaksPoissHacker, Hammertime ja Robinjo.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/login"
        className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
      >
        Alusta
      </Link>
      <Link
        to="/teachers"
        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
      >
        Leia õpetaja
      </Link>
    </div>
      </div>
</section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <FaSearch className="text-4xl text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Otsi ja avasta</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Leia õpetajaid ning vaata nende hinnanguid ja arvustusi.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <FaStar className="text-4xl text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Hinda ja arvusta</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Jaga oma kogemusi ja anna konstruktiivset tagasisidet, et aidata teisi.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <FaUsers className="text-4xl text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Liitu kogukonnaga</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Ühendu õpilaste ja õpetajatega, et parandada õppimiskogemust kõigile.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Oled valmis aitama kujundada hariduse tulevikku?
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Alusta nüüd
        </Link>
      </div>
    </div>
    </>
  );
}
