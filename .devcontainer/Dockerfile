FROM mcr.microsoft.com/devcontainers/base:trixie
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip gzip xz-utils curl\
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean
USER vscode
RUN curl -fsSL https://moonrepo.dev/install/proto.sh | bash -s -- --shell=bash --yes
ENV PROTO_HOME="/home/vscode/.proto"
ENV PATH="$PROTO_HOME/shims:$PROTO_HOME/bin:$PATH"
RUN /bin/bash -c "cd ~ && proto pin node 24 && proto pin npm 12 && proto install"
