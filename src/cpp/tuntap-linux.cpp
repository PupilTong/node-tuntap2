#include "tuntap-methods.hh"

#include <sys/ioctl.h>

#include <arpa/inet.h>
#include <linux/if.h>
#include <linux/if_tun.h>
#include <linux/socket.h>
#include <netinet/ether.h>
#include <netinet/in.h>

#include <fcntl.h>
#include <string.h>
#include <unistd.h>

int init(int fd, bool isTap, char* name) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof(ifr));
    if (isTap) {
        ifr.ifr_flags = IFF_TAP;
    }
    else {
        ifr.ifr_flags = IFF_TUN;
    }

    ifr.ifr_flags |= IFF_NO_PI;
    if (ioctl(fd, TUNSETIFF, &ifr) < 0) {
        return -1;
    }   

    (void)strncpy(name, (char*)(&ifr.ifr_ifrn.ifrn_name), IFNAMSIZ);
    return 0;
}
int getFlags(char* name, int* flag) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof(ifr));
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCGIFFLAGS, &ifr) < 0) {
        (void)close(sock4Fd);
        return -1;
    }
    *flag = ifr.ifr_ifru.ifru_flags;
    (void)close(sock4Fd);

    return 0;
}
int setMac(char* name, char* mac) {
    struct ifreq ifr;

    (void)memset(&ifr, '\0', sizeof(ifr));
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);

    ifr.ifr_ifru.ifru_hwaddr.sa_family = ARPHRD_ETHER;
    auto addr = ether_aton(mac);
    (void)memcpy(&(ifr.ifr_ifru.ifru_hwaddr.sa_data), &(addr->ether_addr_octet), sizeof(addr->ether_addr_octet));

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFHWADDR, &ifr) < 0) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);

    return 0;
}
int setUp(char* name) {
    int currentFlag = 0;
    if (getFlags(name, &currentFlag) < 0) {
        return -1;
    }

    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof(ifr));
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);
    ifr.ifr_flags = (short int)(currentFlag | IFF_UP);

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFFLAGS, &ifr) < 0) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);

    return 0;
}
int setDown(char* name) {
    int currentFlag = 0;
    if (getFlags(name, &currentFlag) < 0) {
        return -1;
    }

    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof(ifr));
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);
    ifr.ifr_flags = (short int)(currentFlag & (~IFF_UP));

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFFLAGS, &ifr) < 0) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);

    return 0;
}
int setMtu(char* name, int mtu) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof ifr);
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);
    ifr.ifr_ifru.ifru_mtu = mtu;

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFMTU, &ifr) == -1) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);
    return 0;
}
int getMtu(char* name, int* mtu) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof ifr);
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCGIFMTU, &ifr) == -1) {
        (void)close(sock4Fd);
        return -1;
    }
    *mtu = ifr.ifr_ifru.ifru_mtu;
    (void)close(sock4Fd);
    return 0;
}
int setIpv4Addr(char* name, char* ipStr) {
    struct in_addr ip;
    (void)memset(&ip, '\0', sizeof(ip));
    if (inet_pton(AF_INET, ipStr, &(ip)) != 1) {
        return -1;
    }

    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof ifr);

    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);
    ifr.ifr_ifru.ifru_addr.sa_family = AF_INET;
    (void)memcpy(&(((struct sockaddr_in*)&ifr.ifr_ifru.ifru_addr)->sin_addr),
                 &ip, sizeof(ip));

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFADDR, &ifr) == -1) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);
    return 0;
}
int setIpv4Netmask(char* name, int maskLen) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof ifr);
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);
    uint32_t maskValue = ~0;
    maskValue = htonl(~(maskValue >> maskLen));
    struct sockaddr_in mask;
    (void)memset(&mask, '\0', sizeof(mask));
    mask.sin_family = AF_INET;
    mask.sin_addr.s_addr = maskValue;
    (void)memcpy(&(ifr.ifr_ifru.ifru_netmask), &mask, sizeof(mask));

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCSIFNETMASK, &ifr) == -1) {
        (void)close(sock4Fd);
        return -1;
    }
    (void)close(sock4Fd);
    return 0;
}
int getIfIndex(char* name, int* index) {
    struct ifreq ifr;
    (void)memset(&ifr, '\0', sizeof ifr);
    (void)strncpy((char*)&(ifr.ifr_ifrn.ifrn_name), name, IFNAMSIZ);

    int sock4Fd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sock4Fd == -1){
        return  -1;
    }
    if (ioctl(sock4Fd, SIOCGIFINDEX, &ifr) == -1) {
        (void)close(sock4Fd);
        return -1;
    }
    *index = ifr.ifr_ifindex;
    (void)close(sock4Fd);
    return 0;
}
int setIpv6(int ifIndex, char* ipStr, int prefix) {
    struct in6_addr ip;
    (void)memset(&ip, '\0', sizeof(ip));
    if (inet_pton(AF_INET6, ipStr, &(ip)) != 1) {
        return -1;
    }

    struct in6_ifreq {
        struct in6_addr ifr6_addr;
        u_int32_t ifr6_prefixlen;
        int ifr6_ifindex; /* Interface index */
    } ifrv6;
    (void)memset(&ifrv6, '\0', sizeof(ifrv6));

    ifrv6.ifr6_ifindex = ifIndex;
    /* Delete previously assigned ipv6 address */
    int sock6Fd = socket(AF_INET6, SOCK_DGRAM, 0);
    if(sock6Fd == -1){
        return  -1;
    }
    (void)ioctl(sock6Fd, SIOCDIFADDR, &ifrv6);
    ifrv6.ifr6_prefixlen = prefix;
    (void)memcpy(&(ifrv6.ifr6_addr), &ip, sizeof(ip));

    if (ioctl(sock6Fd, SIOCSIFADDR, &ifrv6) == -1) {
        (void)close(sock6Fd);
        return -1;
    }
    (void)close(sock6Fd);
    return 0;
}