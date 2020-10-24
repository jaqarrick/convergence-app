import { useEffect, useCallback, useMemo } from "react"
import Peer from "peerjs"

// start by making hooks for peer
const usePeers = (peer: any, stream: MediaStream) => {
	const initCall = useCallback((peer, peerids: Set<string>) => {
		peerids.forEach((id: string) => {})
	}, [])
}

// export default usePeers
