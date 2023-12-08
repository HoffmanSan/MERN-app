
export default function Success() {
  return (
    <div className="w-9/12 p-5 mx-auto mt-6 text-center text-orange-400 bg-white shadow-md max-mobile:w-11/12 max-laptop:w-10/12">
      <h2 className="max-mobile:text-sm max-tablet:text-base">Płatność została zrealizowana</h2>
      <h2 className="py-3 max-mobile:text-sm max-tablet:text-base">Dziękujemy za zakupy</h2>
      <span className="max-mobile:text-xs max-tablet:text-sm">
        Powrót do strony głównej <a href="/" className="font-bold">tutaj</a>
      </span>
    </div>
  )
}
