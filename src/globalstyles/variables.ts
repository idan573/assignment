/* ProductExperience svgs */
export const dislikeBtn = (color: string = ''): string => `data:image/svg+xml,
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
      <stop stop-color="rgb(92,83,136)"/>
      <stop offset="1" stop-color="rgb(36,25,89)"/>
      </linearGradient>
    </defs>

    <g stroke="${color ||
      'url(%23gradient)'}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 10L10 30" />
      <path d="M10 10L30 30" />
    </g>
  </svg>
`;

export const likeBtn = (color: string = ''): string => `data:image/svg+xml,
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="2.5813" y1="4.99695" x2="32.6858" y2="39.5123" gradientUnits="userSpaceOnUse">
        <stop stop-color="rgb(255,230,226)"/>
        <stop offset="1" stop-color="rgb(242,191,183)"/>
      </linearGradient>
    </defs>
    
    <path fill="${color ||
      'url(%23gradient)'}" d="M34.7335 7.68332C33.8822 6.83166 32.8715 6.15607 31.759 5.69513C30.6466 5.23419 29.4543 4.99695 28.2501 4.99695C27.046 4.99695 25.8536 5.23419 24.7412 5.69513C23.6288 6.15607 22.618 6.83166 21.7668 7.68332L20.0001 9.44999L18.2335 7.68332C16.514 5.96384 14.1818 4.99784 11.7501 4.99784C9.3184 4.99784 6.98627 5.96384 5.26678 7.68332C3.5473 9.40281 2.5813 11.7349 2.5813 14.1667C2.5813 16.5984 3.5473 18.9305 5.26678 20.65L7.03345 22.4167L20.0001 35.3833L32.9668 22.4167L34.7335 20.65C35.5851 19.7987 36.2607 18.788 36.7216 17.6756C37.1826 16.5632 37.4198 15.3708 37.4198 14.1667C37.4198 12.9625 37.1826 11.7702 36.7216 10.6577C36.2607 9.5453 35.5851 8.53458 34.7335 7.68332Z"/>
  </svg>
`;
