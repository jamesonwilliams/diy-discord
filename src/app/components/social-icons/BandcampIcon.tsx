
import styles from "./SocialShareIcon.module.css";

export default function BandcampIcon() {
  return (
    <div className={styles.iconContainer}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 30"
        width="24px"
        height="24px"
        clip-rule="evenodd"
        className={styles.icon}
      >
        <path
          d="M15,3C8.373,3,3,8.373,3,15s5.373,12,12,12s12-5.373,12-12S21.627,3,15,3z M17.333,18.774H8.578l4.089-7.547h8.755L17.333,18.774z"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  );
}
