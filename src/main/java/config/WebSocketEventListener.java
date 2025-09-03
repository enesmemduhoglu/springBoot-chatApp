package config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    @EventListener
    public void handleWebSocketDisconnetListener(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessoraccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessoraccessor.getSessionAttributes().get("username");
        if (username != null) {
            log.info("User disconnected: {}", username);
        }
    }

}
