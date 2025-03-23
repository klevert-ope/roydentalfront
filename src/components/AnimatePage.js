"use client";

import {motion} from "framer-motion";
import React from "react";

const pageAnimation = {
	initial: {opacity: 0, y: 30},
	animate: {opacity: 1, y: 0},
	transition: {duration: 0.5},
};

export const AnimatePage = ({children}) => {
	return (<div className="container mx-auto px-2 w-full my-16">
			<motion.div
				initial={pageAnimation.initial}
				animate={pageAnimation.animate}
				transition={pageAnimation.transition}
			>
				{children}
			</motion.div>
		</div>);
};
