// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import {
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";

import checkIconWhite from "../../assets/status-check-white-icon.png";

const getToastStyles = (color?: ToastColor, positionNextToIcon?: boolean) => {
  let toastBackgroundColor = palette.solid.blue;
  switch (color) {
    case "red":
      toastBackgroundColor = palette.solid.red;
      break;
    case "grey":
      toastBackgroundColor = palette.solid.white;
      break;
    default:
      break;
  }

  const wrapperStyles = `
      position: fixed;    
      bottom: 85px;
      right: 25px;
      z-index: 100;
      overflow: hidden;
    `;
  const toastStyles = `
      width: auto;
      max-width: 400px;
      display: flex;
      align-items: center;
      background-color: ${toastBackgroundColor};
      color: ${color === "grey" ? palette.solid.grey1 : palette.solid.white};
      padding: 20px 24px;
      border-radius: 5px;
      ${color === "grey" && `border: 1px solid ${palette.highlight.grey6}`};
    `;
  const checkIconStyles = `
      width: 16px;
      height: 16px;
      margin-right: 8px;
      ${typography.sizeCSS.normal}
    `;

  return { wrapperStyles, toastStyles, checkIconStyles };
};
const animationTransform = [{ opacity: "0%" }, { opacity: "100%" }];
const animationTransformReverse = [{ opacity: "100%" }, { opacity: "0%" }];
const getAnimateProps = (isReverse?: boolean): KeyframeAnimationOptions => ({
  duration: isReverse ? 200 : 400,
  fill: "forwards",
  easing: "ease",
});

type ToastColor = "blue" | "red" | "grey";

type ToastParams = {
  message: string;
  check?: boolean;
  color?: ToastColor;
  timeout?: number;
  preventOverride?: boolean;
  positionNextToIcon?: boolean;
};

const defaultToastParams: Omit<ToastParams, "message"> = {
  check: false,
  color: "blue",
  timeout: 2500,
  preventOverride: false,
  positionNextToIcon: true, // in the Publisher app, there is an icon with 65px width at the top left corner of the screen
};

export const showToast = (params: ToastParams) => {
  const toastParams = { ...defaultToastParams, ...params };
  const {
    message,
    check,
    color,
    timeout,
    preventOverride,
    positionNextToIcon,
  } = toastParams;
  const { wrapperStyles, toastStyles, checkIconStyles } = getToastStyles(
    color,
    positionNextToIcon
  );

  const activeToast = document.querySelector("#toast");

  if (preventOverride && activeToast?.textContent === message) return;

  if (activeToast) {
    activeToast.animate(animationTransformReverse, getAnimateProps(true));
    document.body.removeChild(activeToast);
  }

  const toastElementWrapper = document.createElement(`div`);
  const toastElement = document.createElement(`div`);
  const checkIcon = document.createElement(`img`);

  toastElementWrapper.id = "toast";
  toastElementWrapper.style.cssText = wrapperStyles;

  toastElement.style.cssText = toastStyles;
  toastElement.innerText = message;

  checkIcon.src = checkIconWhite;
  checkIcon.alt = "";
  checkIcon.style.cssText = checkIconStyles;

  toastElementWrapper.appendChild(toastElement);
  if (check) toastElement.prepend(checkIcon);

  document.body.appendChild(toastElementWrapper);

  toastElementWrapper.animate(animationTransform, getAnimateProps());

  // a timeout of -1 keeps the toast from timing out
  if (timeout !== -1) {
    setTimeout(() => {
      toastElementWrapper.animate(
        animationTransformReverse,
        getAnimateProps(true)
      );
      Promise.all(
        toastElementWrapper
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished)
      ).then(() => toastElementWrapper.remove());
    }, timeout);
  }
};
