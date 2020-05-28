(() => {
  const cardContainer = document.querySelectorAll(".card-container");
  const handleClick = (e) => {
    const { target } = e;
    console.log(target);
  };
  for (let i = 0; i < 3; i++) {
    cardContainer[i].addEventListener("click", handleClick);
  }
})();
