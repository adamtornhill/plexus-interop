/**
 * Copyright 2017 Plexus Interop Deutsche Bank AG
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
namespace Plexus.Interop.Broker.Host
{
    using System;
    using Plexus.Host;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;

    public sealed class Program : IProgram
    {
        private static readonly ILogger Log = LogManager.GetLogger<Program>();

        private int _stoped;
        private BrokerRunner _brokerRunner;

        public async Task<int> RunAsync(string[] args)
        {
            try
            {
                var metadataDir = args.Length > 0 ? args[0] : Directory.GetCurrentDirectory();
                _brokerRunner = new BrokerRunner(metadataDir);
                if (_stoped == 1)
                {
                    return 0;
                }
                await _brokerRunner.StartAsync().ConfigureAwait(false);
                await _brokerRunner.Completion.ConfigureAwait(false);
                Log.Debug("Broker process completed");
                return 0;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Terminated with exception");
                return 1;
            }
        }

        public async Task ShutdownAsync()
        {
            Log.Debug("Shutting down");
            if (Interlocked.Exchange(ref _stoped, 1) == 0 && _brokerRunner != null)
            {
                await _brokerRunner.StopAsync().ConfigureAwait(false);
            }
        }
    }
}