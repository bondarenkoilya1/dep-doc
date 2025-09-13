export const createLiElement = (text: string): string => {
  const url = text.split("/").join("-");

  return `<li class="navbar__list-item">
    <a class="navbar__list-link" href=${url}>${text}</a>
  </li>`;
};

export const transferListToHtml = (list: string[]) => {
  return [...list].map(createLiElement).join("");
};
