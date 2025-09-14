export const createLiElement = (text: string): string => {
  return `<li class="navbar__list-item">
    <a class="navbar__list-link" href=${text}>${text}</a>
  </li>`;
};

export const transferListToHtml = (list: string[]) => [...list].map(createLiElement).join("");
