
export default function Failure() {
  return (
    <div className="w-9/12 p-5 mx-auto mt-6 text-center text-orange-400 bg-white shadow-md max-mobile:w-11/12 max-tablet:w-10/12">
      <h2 className="pb-3 max-mobile:text-sm max-tablet:text-base">Wystąpił problem z płatnością</h2>
      <span className="max-mobile:text-xs max-tablet:text-sm">Prosimy spróbować ponownie <a href="/cart" className="font-bold">tutaj</a></span>
    </div>
  )
}
