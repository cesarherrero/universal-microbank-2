/**
 * Decorates the Cards block to match the original CarouselHighlightItem component.
 * @param {Element} block The Cards block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const TEST_IMAGE_URL = 'https://main--universal-microbank-2--sergioeguaras2.aem.live/media_134b848c697e9152f269fa3b79696b855040912ba.png?width=2000&format=webply&optimize=medium';

  const getImageUrl = (path) => {
    if (!path || path === 'negocios312x488.png') return TEST_IMAGE_URL;
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.replace(/^(\.\.\/|\.\/|\/)+/, '');
    if (cleanPath.startsWith('images/')) {
      return `https://www.microbank.com/${cleanPath}`;
    }
    return `https://www.microbank.com/images/${cleanPath}`;
  };

  const section = document.createElement('section');
  section.className = 'hl-carousel no-carousel';

  let descriptionHtml = '';
  const items = [];
  let viewAllLink = null;

  rows.forEach((row, idx) => {
    const cols = [...row.children];

    if (idx === 0) {
      // First row: Title and description
      const titleText = cols[0]?.textContent.trim();
      const title = (titleText && titleText !== '1') ? cols[0].innerHTML : '<h2>Elige el préstamo que mejor se adapte a ti</h2>';
      const desc = cols[1] ? cols[1].innerHTML : '<p>En MicroBank encontrarás productos de financiación a medida para que hagas realidad todos <span class="font-site texto_subrayado">tus proyectos.</span></p>';
      descriptionHtml = `
        <div data-aos="fade-up" class="hl-carousel__description-text aos-fast-mobile">
          ${title}
          ${desc}
        </div>
      `;
    } else if (idx === rows.length - 1 && cols[0] && cols[0].querySelector('a')) {
      // Last row: View all link
      const link = cols[0].querySelector('a');
      viewAllLink = link;
    } else {
      // Intermediate rows: Carousel Items
      const imgCol = cols[0];
      const titleText = cols[1] ? cols[1].textContent : '';
      const tagText = cols[2] ? cols[2].textContent : '';
      const nriText = cols[3] ? cols[3].textContent : '';
      const linkEl = cols[4] ? cols[4].querySelector('a') : null;

      let imgSrc = '';
      if (imgCol) {
        const img = imgCol.querySelector('img');
        if (img) {
          imgSrc = img.src;
        } else if (imgCol.textContent.trim()) {
          imgSrc = imgCol.textContent.trim();
        }
      }

      items.push({
        imgSrc: getImageUrl(imgSrc),
        title: titleText,
        tag: tagText,
        nri: nriText,
        href: linkEl ? linkEl.href : '#',
        srLabel: linkEl ? linkEl.textContent : titleText,
      });
    }
  });

  // If no items were parsed, or there's only 1 row (which was treated as description),
  // populate with fallback/mock items
  if (items.length === 0) {
    for (let i = 0; i < 4; i += 1) {
      items.push({
        imgSrc: TEST_IMAGE_URL,
        title: 'Lorem ipsum dolor sit amet consectetur',
        tag: 'Lorem Ipsum',
        nri: 'Lorem Ipsum',
        href: '#',
        srLabel: 'Lorem Ipsum',
      });
    }
  }

  // Ensure descriptionHtml is set if rows was empty
  if (!descriptionHtml) {
    descriptionHtml = `
      <div data-aos="fade-up" class="hl-carousel__description-text aos-fast-mobile">
        <h2>Elige el préstamo que mejor se adapte a ti</h2>
        <p>En MicroBank encontrarás productos de financiación a medida para que hagas realidad todos <span class="font-site texto_subrayado">tus proyectos.</span></p>
      </div>
    `;
  }

  // 1. Build Description
  const descContainer = document.createElement('div');
  descContainer.className = 'hl-carousel__description container tight';
  descContainer.innerHTML = `
    <div class="row">
      <div class="col">
        ${descriptionHtml}
      </div>
    </div>
  `;
  section.appendChild(descContainer);

  // 2. Build Highlights Container
  const highlightsDiv = document.createElement('div');
  highlightsDiv.className = 'hl-carousel__highlights';

  const wrap = document.createElement('div');
  wrap.className = 'hl-carousel__highlights-wrap';

  items.forEach((item, idx) => {
    const article = document.createElement('article');
    article.className = 'hl-carousel__highlights-item';
    article.setAttribute('data-c2d-cmp-name', 'CarouselHighlightItem');
    article.setAttribute('data-c2d-cmp-variants', `slide:${idx + 1}`);
    article.setAttribute('data-aos-duration', '1000');
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-offset', '100');
    article.setAttribute('data-aos-delay', `${(idx + 1) * 100}`);

    article.innerHTML = `
      <a href="${item.href}"> 
        <span class="sr-only" data-c2d-cmp-text-property="sr-label">${item.srLabel}</span>
        <div class="hl-carousel__highlights-item-img"> 
          <img src="${item.imgSrc}" alt="" role="presentation" aria-hidden="true" /> 
        </div>
        <div class="hl-carousel__highlights-item-text">
          <h3 data-c2d-cmp-text-property="title">${item.title}</h3>
          <div class="tags">
            <p data-c2d-cmp-text-property="tag">${item.tag}</p>
          </div>
          <p class="hl-carousel__highlights-nri" data-c2d-cmp-text-property="nri">${item.nri}</p>
        </div>
      </a>
    `;
    wrap.appendChild(article);
  });
  highlightsDiv.appendChild(wrap);

  // 3. Build view all link (use fallback if no link was authored)
  const href = viewAllLink ? viewAllLink.href : '#';
  const text = viewAllLink ? viewAllLink.textContent : 'Ver todos los productos';
  const linkDiv = document.createElement('div');
  linkDiv.className = 'hl-carousel__highlights-link';
  linkDiv.innerHTML = `<p><a href="${href}" title="${text}">${text}</a></p>`;
  highlightsDiv.appendChild(linkDiv);

  section.appendChild(highlightsDiv);
  block.appendChild(section);
}
