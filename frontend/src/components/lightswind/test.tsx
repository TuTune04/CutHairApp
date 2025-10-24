"use client"

import React from "react"
import clsx from "clsx"
import style from "./test.module.css"

interface SplitCardProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export default function SplitCard({
  icon,
  title = "Card Title",
  description = "This is a cool reusable split card.",
  className,
}: SplitCardProps) {
  return (
    <div className={clsx(style.cardContainer, className)}>
      <div className={style.card}>
        <div className={style.face1}>
          <div className={style.content}>{icon}</div>
        </div>
        <div className={style.face2}>
          <div className={style.content}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}