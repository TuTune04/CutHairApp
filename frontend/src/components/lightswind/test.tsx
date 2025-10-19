"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import styles from "./test.module.css"

export default function Test() {
  return (
    <div >
        <div className={styles.card}>card 1</div>
        <div className={styles.card}>card 2</div>
        <div className={styles.card}>card 3</div>
    </div>
  )
}