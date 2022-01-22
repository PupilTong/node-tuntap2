#ifndef tuntap_methods
#define tuntap_methods
int init(int fd, bool isTap, char* name);
int getFlags(char* name, int* flag);
int setMac(char* name, char* mac);
int setUp(char* name);
int setDown(char* name);
int setMtu(char* name, int mtu);
int getMtu(char* name, int* mtu);
int setIpv4Addr(char* name, char* ipStr);
int setIpv4Netmask(char* name, int maskLen);
int getIfIndex(char* name, int* index);
int setIpv6(int ifIndex, char* ipStr, int prefix);
#endif