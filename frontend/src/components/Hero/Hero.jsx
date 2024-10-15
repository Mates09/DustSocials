import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";
import img from "../../assets/hero/heroImg1.png";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Matej Šnirc</h1>
        <p className={styles.description}>
          I'm a full-stack developer with 3 years of experience using React and
          NodeJS. I wil be happy to work with you.
        </p>
        <a href="mailto:matej.snirc1@gmail.com" className={styles.contactBtn}>
          Contact Me
        </a>
      </div>
      {/*  <div className={styles.wheel}>
        <img src={getImageUrl("skills/atom.png")} alt="" />
        <img src={getImageUrl("skills/nodejs.png")} alt="" />
        <img src={getImageUrl("skills/js.png")} alt="" />
        <img src={getImageUrl("skills/typescript.png")} alt="" />
      </div> */}
      <img src={img} alt="Hero image of me" className={styles.heroImg} />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
