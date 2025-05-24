import React, { useState } from "react"
import { Modal, IconButton, Box, Fade, Backdrop, Zoom, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { ExternalLink, Award } from "lucide-react"

const Certificate = ({ ImgSertif, Title }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Convert Google Drive link to direct image link
	const getDirectImageLink = (driveLink) => {
		if (!driveLink) return "";
		// Extract file ID from Google Drive link
		const fileId = driveLink.match(/\/d\/(.*?)\/view/)?.[1];
		if (!fileId) return driveLink;
		
		// Return the direct preview link
		return `https://drive.google.com/file/d/${fileId}/preview`;
	};

	const handleCertificateClick = () => {
		if (ImgSertif) {
			window.open(ImgSertif, "_blank");
		}
	};

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				className=""
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
					},
				}}>
				{/* Certificate Icon Container */}
				<Box
					sx={{
						position: "relative",
						height: "200px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 1,
						},
					}}>
					<Award
						className="certificate-icon"
						style={{
							width: "80px",
							height: "80px",
							color: "#6366f1",
							zIndex: 2,
							transition: "all 0.3s ease",
						}}
					/>
				</Box>

				{/* Certificate Title with Link */}
				<Box
					sx={{
						padding: "12px",
						background: "rgba(0, 0, 0, 0.7)",
						color: "white",
						fontSize: "0.875rem",
						textAlign: "center",
						zIndex: 2,
						cursor: "pointer",
						"&:hover": {
							background: "rgba(0, 0, 0, 0.8)",
						},
					}}
					onClick={handleCertificateClick}>
					<div className="flex items-center justify-center gap-2">
						<span>{Title}</span>
						<ExternalLink className="w-4 h-4" />
					</div>
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0,
						transition: "all 0.3s ease",
						cursor: "pointer",
						zIndex: 2,
					}}
					onClick={handleOpen}>
					{/* Hover Content */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -60%)",
							opacity: 0,
							transition: "all 0.4s ease",
							textAlign: "center",
							width: "100%",
							color: "white",
						}}>
						<FullscreenIcon
							sx={{
								fontSize: 40,
								mb: 1,
								filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
							}}
						/>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								textShadow: "0 2px 4px rgba(0,0,0,0.3)",
							}}>
							View Certificate
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Modal */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
					"& .MuiBackdrop-root": {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
					},
				}}>
				<Box
					sx={{
						position: "relative",
						width: "90vw",
						height: "90vh",
						m: 0,
						p: 0,
						outline: "none",
						"&:focus": {
							outline: "none",
						},
					}}>
					{/* Close Button */}
					<IconButton
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.6)",
							zIndex: 1,
							padding: 1,
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.8)",
								transform: "scale(1.1)",
							},
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 24 }} />
					</IconButton>

					{/* Modal Content - Using iframe for Google Drive preview */}
					<iframe
						src={getDirectImageLink(ImgSertif)}
						title={Title}
						style={{
							width: "100%",
							height: "100%",
							border: "none",
						}}
						allowFullScreen
					/>
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
