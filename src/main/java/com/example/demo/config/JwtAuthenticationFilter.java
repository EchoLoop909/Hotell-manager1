//package com.example.demo.config;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//
//import java.io.IOException;
//
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//    @Autowired
//    private JwtUtils jwtUtils;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest httpServletRequest,
//                                    HttpServletResponse httpServletResponse,
//                                    FilterChain filterChain)
//                                    throws ServletException, IOException{
//        // Lấy header Authorization từ request
//        String header = httpServletRequest.getHeader("Authorization");
//        String token = null;
//        String username = null;
//
//        // Kiểm tra header có tồn tại và bắt đầu bằng "Bearer "
//        if(header != null && header.startsWith("Bearer ")) {
//            // Cắt chuỗi "Bearer " để lấy token thật sự
//            token = header.substring(7);
//            try{
//                // Trích xuất username từ token
//                username = jwtUtils.extractToken(token);
//            }catch (Exception e) {
////                logger.error("Không thể giải mã token: " + e.getMessage());
//            }
//        }
//
//        //neu da co username ma chua duoc xac thuc trong SecurityContext
//        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            //tai thong tin nguoi dung tu CSDL
//            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//
//            // Kiểm tra tính hợp lệ của token (trùng username, chưa hết hạn, không bị giả mạo)
//            if (jwtUtils.validateToken(token, userDetails)) {
//                // Tạo đối tượng Authentication để Spring Security xác thực user này
//                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//                        userDetails,//thong tin nguoi dung
//                        null,
//                        userDetails.getAuthorities()//roles
//                );
//                // Gắn thêm chi tiết từ request (như địa chỉ IP, session ID,...)
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
//
//                // Đặt Authentication đã xác thực vào SecurityContext để toàn hệ thống biết user này đã login
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//            }
//
//            // Cho phép request tiếp tục đi qua các filter tiếp theo
//            filterChain.doFilter(httpServletRequest, httpServletResponse);
//        }
//    }
//}
package com.example.demo.config;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull  HttpServletResponse response,
            @NonNull  FilterChain filterChain)
     throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            if (authHeader != null || !authHeader.startsWith("Bearer ")) { code ban dau

                filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt) ; //todo extract the userEmail from Jwt token
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request,response);
    }
}
