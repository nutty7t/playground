# Motivation

In Nix, I've encountered some problems installing and executing Node programs
that involve native dependencies (i.e. Electron/iohook). `process.dlopen` is a
Node process method that allows for dynamically loading shared objects, and it
pops up in the error messages that I see. I don't know much about Nix, but I
suspect the errors occur because shared object files are not stored in the
traditional global paths that programs normally look in.

RPATH designates the run-time search path hard-coded in an executable file or
library. Here's how you can inspect it:

``` sh
nix-shell -p binutils ripgrep
readelf --all <executable> | rg -i rpath
readelf --all <executable> | rg -i runpath
```

I read that `RUNPATH` is the same as `RPATH`, but is searched after
`LD_LIBRARY_PATH`. So the order in which linkers will search libraries is:

0. `RPATH` in library causing lookup (set at build time)
1. `RPATH` in executable (set at build time)
2. `LD_LIBRARY_PATH` (environment variable, set at runtime)
3. `RUNPATH` (set at build time)
4. `/etc/ld.so.cache`
5. `/lib` and `/usr/lib`

I came across this tool. It might be handy.

PatchELF :: a tool for modifying ELF executables and libraries

- change the dynamic loader ("ELF interpreter")
- change RPATH

``` sh
# Change the dynamic loader ("ELF interpreter") of executables:
patchelf --set-interpreter /lib/my-id-linux.so.2 my-program

# Change the RPATH of executables and libraries:
patchelf --set-rpath /opt/my-libs/lib:/other-libs my-program
```

## Trying Something

In the `Packaging/Binaries` docs, it is mentioned:

> Downloading and attempting to run a binary on NixOS will almost never work.
> This is due to hard-coded paths in the executable. Unfortunately, almost all
> unfree and proprietary software comes in binary form - the main reason to
> include binaries is because no source code is available.

When I `npm install electron`, it downloads an executable to
`./node_modules/electron/dist/electron`. Just like the docs said, it didn't
work. Check out what we get when we try to inspect the dynamic loader:

``` sh
$ readelf -a node_modules/electron/dist/electron | grep -i interpreter
      [Requesting program interpreter: /lib64/ld-linux-x86-64.so.2]
```

That path doesn't exist on my system. OK, the docs mention that we can patch
the interpreter and see if the executable works.

``` sh
$ patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" node_modules/electron/dist/electron
warning: working around a Linux kernel bug by creating a hole of 987136 bytes in ‘node_modules/electron/dist/electron’

$ readelf -a node_modules/electron/dist/electron | grep -i interpreter
      [Requesting program interpreter: /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/ld-linux-x86-64.so.2]

$ npx electron .
/root/Code/electron-quick-start/node_modules/electron/dist/electron: error while loading shared libraries: libgobject-2.0.so.0: cannot open shared object file: No such file or directory
```

Woohoo! The interpreter works! But it can't find the shared objects. What are
the required libraries?

``` sh
$ patchelf --print-needed node_modules/electron/dist/electron
libffmpeg.so
libdl.so.2
libpthread.so.0
librt.so.1
libgobject-2.0.so.0
libglib-2.0.so.0
libgio-2.0.so.0
libX11.so.6
libX11-xcb.so.1
libxcb.so.1
libXcomposite.so.1
libXcursor.so.1
libXdamage.so.1
libXext.so.6
libXfixes.so.3
libXi.so.6
libXrender.so.1
libXtst.so.6
libnss3.so
libnssutil3.so
libsmime3.so
libnspr4.so
libdbus-1.so.3
libgdk_pixbuf-2.0.so.0
libgtk-3.so.0
libgdk-3.so.0
libpangocairo-1.0.so.0
libpango-1.0.so.0
libatk-1.0.so.0
libcairo.so.2
libm.so.6
libexpat.so.1
libXrandr.so.2
libXss.so.1
libasound.so.2
libatk-bridge-2.0.so.0
libatspi.so.0
libcups.so.2
libgcc_s.so.1
libc.so.6
ld-linux-x86-64.so.2
```

Alright, how many of these libraries can be found? `ldd` is a program that can
print the shared object dependencies of an executable.

```
$ ldd node_modules/electron/dist/electron
        linux-vdso.so.1 (0x00007fff14fd1000)
        libffmpeg.so => /root/Code/electron-quick-start/node_modules/electron/dist/libffmpeg.so (0x00007fc39c11b000)
        libdl.so.2 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libdl.so.2 (0x00007fc39c116000)
        libpthread.so.0 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libpthread.so.0 (0x00007fc39c0f5000)
        librt.so.1 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/librt.so.1 (0x00007fc39c0eb000)
        libgobject-2.0.so.0 => not found
        libglib-2.0.so.0 => not found
        libgio-2.0.so.0 => not found
        libX11.so.6 => not found
        libX11-xcb.so.1 => not found
        libxcb.so.1 => not found
        libXcomposite.so.1 => not found
        libXcursor.so.1 => not found
        libXdamage.so.1 => not found
        libXext.so.6 => not found
        libXfixes.so.3 => not found
        libXi.so.6 => not found
        libXrender.so.1 => not found
        libXtst.so.6 => not found
        libnss3.so => not found
        libnssutil3.so => not found
        libsmime3.so => not found
        libnspr4.so => not found
        libdbus-1.so.3 => not found
        libgdk_pixbuf-2.0.so.0 => not found
        libgtk-3.so.0 => not found
        libgdk-3.so.0 => not found
        libpangocairo-1.0.so.0 => not found
        libpango-1.0.so.0 => not found
        libatk-1.0.so.0 => not found
        libcairo.so.2 => not found
        libm.so.6 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libm.so.6 (0x00007fc39bfa1000)
        libexpat.so.1 => not found
        libXrandr.so.2 => not found
        libXss.so.1 => not found
        libasound.so.2 => not found
        libatk-bridge-2.0.so.0 => not found
        libatspi.so.0 => not found
        libcups.so.2 => not found
        libgcc_s.so.1 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libgcc_s.so.1 (0x00007fc39bf85000)
        libc.so.6 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libc.so.6 (0x00007fc39bdc6000)
        /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/ld-linux-x86-64.so.2 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib64/ld-linux-x86-64.so.2 (0x00007fc3a36f6000)
```

Dang, that's crazy. I've also had problems with getting `iohook` to work.

```
$ ldd node_modules/iohook/builds/node-v64-linux-x64/build/Release/iohook.node
ldd: $warning: you do not have execution permission for `node_modules/iohook/builds/node-v64-linux-x64/build/Release/iohook.node'
        linux-vdso.so.1 (0x00007ffed372f000)
        libxkbcommon-x11.so.0 => not found
        libxkbcommon.so.0 => not found
        libX11-xcb.so.1 => not found
        libxcb.so.1 => not found
        libXinerama.so.1 => not found
        libXt.so.6 => not found
        libXtst.so.6 => not found
        libX11.so.6 => not found
        libstdc++.so.6 => not found
        libgcc_s.so.1 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libgcc_s.so.1 (0x00007f540e619000)
        libc.so.6 => /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib/libc.so.6 (0x00007f540e45a000)
        /nix/store/an6bdv4phxsz14q2sk57iscl2dc7bnj1-glibc-2.30/lib64/ld-linux-x86-64.so.2 (0x00007f540e849000)
```

Yup, it makes sense why it's not working.

Some tools to locate dependencies and create the library path to be used to
patch the `RPATH` in the ELF files: `nix-index` (and `nix-locate`), the
`lib.makeLibraryPath` Nix function, and `patchelf`.

## References

https://www.physics.drexel.edu/~wking/unfolding-disasters-old/posts/rpath/
https://gist.github.com/mbohun/4191988
https://nixos.wiki/wiki/Packaging/Binaries
